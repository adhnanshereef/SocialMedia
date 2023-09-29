from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from user.models import User
from user.serializers import UserSerializer
from .serializers import FollowersFollowingSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user(request, username):
    # Get the user with the provided username
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    # Serialize the user data
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_followers_followings(request, username):
    # Get the user with the provided username
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    followers = user.followers.all()
    following = user.following.all()
    data = {
        'followers': followers,
        'following': following,
    }
    
    # Serialize the followers and following data
    serializer = FollowersFollowingSerializer(data)
    return Response(serializer.data, status=status.HTTP_200_OK)
