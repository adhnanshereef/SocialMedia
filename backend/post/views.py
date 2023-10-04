from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import PostSerializer
from account.serializers import UserSerializers
from .models import Post


@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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
