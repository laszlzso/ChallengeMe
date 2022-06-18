from django.urls import path
from .views import (
    ChallengeListApiView,
    ChallengeApiView
)

urlpatterns = [
    path('', ChallengeListApiView.as_view()),
    path('<int:challenge_id>', ChallengeApiView.as_view()),
]
