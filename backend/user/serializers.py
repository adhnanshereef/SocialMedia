from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Claims
        token['username'] = user.username
        token['name'] = user.name
        token['profile'] = user.profile_pic.url

        return token
