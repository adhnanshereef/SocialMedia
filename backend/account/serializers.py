from rest_framework import serializers
from user.models import User  # Import your User model here

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'name', 'profile_pic']

class FollowersFollowingSerializer(serializers.Serializer):
    """
    Serializer for retrieving a user's followers and following.
    """
    followers = UserSerializers(many=True)
    following = UserSerializers(many=True)

    def create(self, validated_data):
        # followers_data = validated_data.pop('followers')
        # following_data = validated_data.pop('following')
        # followers = [User.objects.create(**follower_data) for follower_data in followers_data]
        # following = [User.objects.create(**following_data) for following_data in following_data]
        # return {'followers': followers, 'following': following}
        ...

    def update(self, instance, validated_data):
        # instance.followers = validated_data.get('followers', instance.followers)
        # instance.following = validated_data.get('following', instance.following)
        # instance.save()
        # return instance
        ...

class FollowingSerializer(serializers.Serializer):
    """
    Serializer for retrieving a user's followers and following.
    """
    following = UserSerializers(many=True)

    def create(self, validated_data):
        ...

    def update(self, instance, validated_data):
        ...

    
