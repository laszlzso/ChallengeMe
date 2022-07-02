from django.urls import path
from .challenge_views import (
    ChallengeListApiView,
    ChallengeApiView
)
from .challenge_type_views import (
    ChallengeTypeListApiView,
    ChallengeTypeApiView
)

urlpatterns = [
    path('challenges/', ChallengeListApiView.as_view()),
    path('challenges/<int:challenge_id>', ChallengeApiView.as_view()),
    path('challenge-types/', ChallengeTypeListApiView.as_view()),
    path('challenge-types/<int:challenge_type_id>', ChallengeTypeApiView.as_view()),
]
