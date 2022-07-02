from django.contrib import admin
from .models import (
    Challenge,
    ChallengeType,
    ChallengeSchedule,
    ChallengeCompletionEntry
)

admin.site.register(Challenge)
admin.site.register(ChallengeType)
admin.site.register(ChallengeSchedule)
admin.site.register(ChallengeCompletionEntry)
