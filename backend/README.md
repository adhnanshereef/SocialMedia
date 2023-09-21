# Django Authentication for Api in Backend

## Installation

```
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

## Settings

> Add the following to your settings.py file

### Installed Apps

```
INSTALLED_APPS = [
    ...
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    ...
]
```

### Rest Framework

```
REST_FRAMEWORK = {
    ...
    'DEFAULT_PERMISSION_CLASSES': [
       'rest_framework.permissions.IsAuthenticated',
   ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        ...
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
    ...
}
```

### Middleware

```
MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

### Cors Headers

```
CORS_ALLOWED_ORIGINS = [
    ...
    "http://localhost:4200",
    ...
]
```

> OR 

```
CORS_ORIGIN_ALLOW_ALL = True
```

### Import

```
from datetime import timedelta
from django.conf import settings
```

### Simple JWT

```
SECRET_KEY = ''

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": settings.SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}
```

## Urls

> Add the following to your urls.py file

```  
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    ...
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ...
]
```

## Custom Serializer

> Create a file called serializers.py in your app folder

```
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
```
> Add the following to your settings.py file

```
SIMPLE_JWT = {
    ...
    "TOKEN_OBTAIN_SERIALIZER": "app_name.serializers.MyTokenObtainPairSerializer",
    ...
}
```

## Get Token in Views
    
```
from .serializers import MyTokenObtainPairSerializer

api_view(['POST'])
def login(request):
    ...
    # Serialize the token data using your custom serializer
    serializer = MyTokenObtainPairSerializer(data={
        "username": user.username,
        "password": password,
    })
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
    ...
```

> Note: The password should not be hashed

