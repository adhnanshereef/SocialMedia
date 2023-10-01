from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import PostSerializer
from .models import Post

@api_view(['GET'])
@permission_classes([AllowAny])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PostSerializer(post)
    return Response(serializer.data, status=status.HTTP_200_OK)

