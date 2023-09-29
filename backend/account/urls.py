from django.urls import path
from . import views


urlpatterns = [
    path('users/<str:username>/', views.get_user, name='get_user'),
]