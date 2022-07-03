from django.urls import path
from .challenge_views import (
    ChallengeListApiView,
    ChallengeApiView,
    ChallengeSchedulesApiView
)
from .challenge_type_views import (
    ChallengeTypeListApiView,
    ChallengeTypeApiView
)

from .challenge_schedule_views import (
    ChallengeScheduleListApiView,
    ChallengeScheduleApiView
)

from .challenge_completion_entry_views import (
    ChallengeCompletionEntryListApiView,
    ChallengeCompletionEntryApiView
)

urlpatterns = [
    path('challenges/', ChallengeListApiView.as_view()),
    path('challenges/<int:challenge_id>', ChallengeApiView.as_view()),
    path('challenges/<int:challenge_id>/schedules/', ChallengeSchedulesApiView.as_view()),
    path('challenge-types/', ChallengeTypeListApiView.as_view()),
    path('challenge-types/<int:challenge_type_id>', ChallengeTypeApiView.as_view()),
    path('challenge-schedules/', ChallengeScheduleListApiView.as_view()),
    path('challenge-schedules/<int:challenge_schedule_id>', ChallengeScheduleApiView.as_view()),
    path('challenge-completion-entries/', ChallengeCompletionEntryListApiView.as_view()),
    path('challenge-completion-entries/<int:challenge_completion_entry_id>', ChallengeCompletionEntryApiView.as_view()),
]
