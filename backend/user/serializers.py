from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Claims
        token['username'] = user.username
        token['name'] = user.name
        token['profile'] = user.profile_pic.url

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'name', 'email', 'bio', 'dateofbirth',
                  'profile_pic', 'followers', 'following', 'joined']
        read_only_fields = ['followers', 'following', 'joined']
