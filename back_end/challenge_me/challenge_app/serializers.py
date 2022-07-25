from rest_framework import serializers
from .models import (
    Challenge,
    ChallengeType,
    ChallengeSchedule,
    ChallengeCompletionEntry
)


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['challenge_id', 'title', 'start_date', 'end_date']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError('Start date must be before end date')
        return data


class ChallengeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeType
        fields = ['challenge_type_id', 'name', 'unit']


class ChallengeScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeSchedule
        fields = ['challenge_schedule_id',
                  'challenge_id',
                  'user_id',
                  'challenge_type_id',
                  'daily_goal',
                  'start_date',
                  'day_frequency']


class ChallengeCompletionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeCompletionEntry
        fields = ['challenge_completion_entry_id',
                  'challenge_schedule_id',
                  'timestamp',
                  'amount']
