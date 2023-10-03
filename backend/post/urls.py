from django.urls import path
from . import views


urlpatterns = [
    path('all/', views.get_posts, name='get_posts'),
    path('create/', views.create_post, name='create_post'),
    path('like/', views.like_post, name='like_post'),
    path('<int:pk>/', views.get_post, name='get_post'),
]