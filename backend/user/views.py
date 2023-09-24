""" Contains Signup, Edit and Delete User """
from django.contrib.auth import authenticate
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import User  # User Model
from .serializers import MyTokenObtainPairSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    # Get username, email, name and password from the request data
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    name = request.data.get('name')

    # If username, password, name or email is not provided, return an error
    if not username or not password or not email or not name:
        return Response({'error': 'Username, Password, Email, Name Required'}, status=status.HTTP_400_BAD_REQUEST)

    #  Check if a user with the provided username or email already exists.
    existing_username_user = User.objects.filter(username=username).first()
    existing_email_user = User.objects.filter(email=email).first()

    if existing_username_user or existing_email_user:
        return Response({'error': 'User with this username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    # If no user exists with the provided username or email, create a new user.
    user = User.objects.create_user(
        username=username, email=email, name=name, password=password)
    user.save()

    # Authenticate the user
    user = authenticate(username=username, password=password)
    if user:
        # Serialize the token data using your custom serializer
        serializer = MyTokenObtainPairSerializer(data={
            "username": user.username,
            "password": password,
        })
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Authentication failed.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit(request):
    # Get user data from the request data
    username = request.data.get('username')
    email = request.data.get('email')
    name = request.data.get('name')
    bio = request.data.get('bio')
    dob = request.data.get('dateofbirth')

    # Get the profile picture file from the request
    profile_pic = request.FILES.get('profile_pic')

    # Get the old profile picture path before updating
    old_profile_pic = request.user.profile_pic.path if request.user.profile_pic else None

    # If no user exists with the provided username or email, update the user's data.
    user = request.user
    if username:
        user.username = username
    if email:
        user.email = email
    if name:
        user.name = name
    if bio:
        user.bio = bio
    if dob:
        user.dateofbirth = dob
    if profile_pic:
        user.profile_pic = profile_pic

    if old_profile_pic and not old_profile_pic.endswith('user.svg') and profile_pic :
        default_storage.delete(old_profile_pic)

    user.save()

    return Response({'success': 'User Updated'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete(request):
    user = User.objects.get(id=request.user.id)
    user.delete()

    return Response({'success': 'User Deleted'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getuser(request):
    user = User.objects.get(id=request.user.id)
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
