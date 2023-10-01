from rest_framework import serializers
from account.serializers import UserSerializers
from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializers()
    likes = UserSerializers(many=True)
    shares = UserSerializers(many=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'likes',
                  'shares', 'views', 'comments', 'created', 'photo']

    def get_photo(self, obj):
        if obj.photo:
            return obj.photo.url
        else:
            return None


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializers()

    class Meta:
        model = Comment
        fields = ['user', 'content', 'created']
