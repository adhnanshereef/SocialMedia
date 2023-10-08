from django.urls import path
from . import views


urlpatterns = [
    path('all/', views.get_posts, name='get_posts'),
    path('create/', views.create_post, name='create_post'),
    path('like/', views.like_post, name='like_post'),
    path('comment/create/', views.create_comment, name='create_comment'),
    path('comments/<int:pk>/', views.get_comments, name='get_comments'),
    path('comment/<int:pk>/delete/', views.delete_comment, name='delete_comment'),
    path('<int:pk>/delete/', views.delete_post, name='delete_post'),
    path('<int:pk>/', views.get_post, name='get_post'),
]