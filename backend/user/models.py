from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin

import os
import uuid
from django.conf import settings


# To get random name for profile picture
def profile_pic_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('profile_pic/', filename)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=50, unique=True, blank=False, null=False)
    email = models.EmailField(
        "email address", unique=True, blank=False, null=False)
    name = models.CharField(max_length=50, blank=False, null=False)
    bio = models.TextField(blank=True, max_length=160)
    profile_pic = models.ImageField(
        default="user.svg", upload_to=profile_pic_filename)
    following = models.ManyToManyField(
        'self', related_name='folowing', blank=True, symmetrical=False)
    followers = models.ManyToManyField(
        'self', related_name='folower', blank=True, symmetrical=False)
    dateofbirth = models.DateField(blank=True, null=True)
    joined = models.DateField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "name"]

    objects = UserManager()

    def __str__(self):
        return self.username
        
    def delete(self, *args, **kwargs):
        if self.profile_pic.url != settings.MEDIA_URL + 'user.svg':
            self.profile_pic.delete()
        
        super().delete(*args, **kwargs)
    

