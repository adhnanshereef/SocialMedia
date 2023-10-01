from django.urls import path
from . import views


urlpatterns = [
    path('all/', views.get_posts, name='get_posts'),
    path('<int:pk>/', views.get_post, name='get_post'),
]