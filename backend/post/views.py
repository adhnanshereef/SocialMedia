from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from .serializers import PostSerializer, CommentSerializer
from account.serializers import UserSerializers
from .models import Post, Comment


class PostPagination(PageNumberPagination):
    page_size = 3  # Adjust the number of posts per page as needed

@api_view(['GET'])
def get_posts(request):
    paginator = PostPagination()
    posts = Post.objects.all()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def get_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        post.views += 1
        post.save()
    serializer = PostSerializer(post)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request):
    user = request.user
    post_id = request.data.get('id')
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializers(user).data
    if (user in post.likes.all()):
        post.likes.remove(user)
        return Response({'do': 'disliked', 'user': serializer}, status=status.HTTP_200_OK)
    else:
        post.likes.add(user)
        return Response({'do': 'liked', 'user': serializer}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    user = request.user
    title = request.data.get('title')
    content = request.data.get('content')
    photo = request.data.get('photo')
    if title and len(title) > 100:
        return Response({'error': 'Title length cannot exceed 100 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    if title and content and photo:
        post = Post.objects.create(
            user=user, title=title, content=content, photo=photo)
        post.save()
        serializer = PostSerializer(post)
        pk = str(serializer.data['id'])
        return Response(pk, status=status.HTTP_201_CREATED)
    elif title and content:
        post = Post.objects.create(user=user, title=title, content=content)
        post.save()
        serializer = PostSerializer(post)
        pk = str(serializer.data['id'])
        return Response(pk, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Title and content are required.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    if request.user == post.user:
        post.delete()
        return Response(True, status=status.HTTP_200_OK)
    else:
        return Response(False, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    user = request.user
    post_id = request.data.get('id')
    content = request.data.get('content')
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    if content:
        comment = Comment.objects.create(
            user=user, post=post, content=content)
        post.comments += 1
        post.save()
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Content is required.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_comments(request, pk):
    try:
        post = Post.objects.get(id=pk)
    except (ValueError, Post.DoesNotExist):
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    comments = Comment.objects.filter(post=post)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    if request.user == comment.user:
        post = comment.post
        comment.delete()
        if (post.comments > 0):
            post.comments -= 1
        else:
            post.comments = 0
        post.save()
        return Response(True, status=status.HTTP_200_OK)
    else:
        return Response(False, status=status.HTTP_200_OK)
