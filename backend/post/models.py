"""Contains Post Model and Comment Model"""
import os
import uuid
import shutil
from django.db import models
from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from user.models import User


# To get random name for photo of the post
def photo_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('post/', str(instance.user.id), filename)


class Post(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    shares = models.ManyToManyField(User, related_name='shares', blank=True)
    views = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to=photo_filename, blank=True, null=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        if len(self.title) > 20:
            return self.title[:20]+'...'
        else:
            return self.title

    def delete(self, *args, **kwargs):
        if self.photo:
            path = os.path.join(settings.MEDIA_ROOT, str(self.photo))
            if os.path.exists(path):
                os.remove(path)
        super().delete(*args, **kwargs)


@receiver(pre_delete, sender=User)
def delete_user(sender, instance, **kwargs):
    path = os.path.join(settings.MEDIA_ROOT, 'post', str(instance.id))
    if os.path.exists(path):
        shutil.rmtree(path)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        if len(self.content) > 20:
            return self.content[:20]+'...'
        else:
            return self.content
