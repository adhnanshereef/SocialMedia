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
    serializer = PostSerializer(post)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likePost(request):
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
