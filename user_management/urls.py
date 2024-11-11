from django.urls import path
from .views import UserProfileView, LogoutView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
