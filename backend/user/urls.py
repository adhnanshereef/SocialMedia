from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView,
)

urlpatterns = [
    path('getuser/', views.getuser, name='getuser'),
    path('signup/', views.signup, name='signup'),
    path('edit/', views.edit, name='edit_user'),
    path('delete/', views.delete, name='delete_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
