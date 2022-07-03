from collections import OrderedDict
import logging
from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from .models import (
    Challenge,
    ChallengeSchedule,
    ChallengeCompletionEntry
)
from .serializers import (
    ChallengeSerializer,
    ChallengeScheduleSerializer,
    ChallengeCompletionEntrySerializer
)

logger = logging.getLogger('django')


class ChallengeListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
        challenges = Challenge.objects.all()
        serializer = ChallengeSerializer(challenges, many=True)
        logger.info('Retrieved %s challenge entries', len(serializer.data))
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        data = {
            'title': request.data.get('title'),
            'start_date': datetime.strptime(request.data.get('start_date').split('T')[0], '%Y-%m-%d').date(),
            'end_date': datetime.strptime(request.data.get('end_date').split('T')[0], '%Y-%m-%d').date()
        }
        serializer = ChallengeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChallengeApiView(APIView):
    def get_object(self, challenge_id):
        try:
            return Challenge.objects.get(challenge_id=challenge_id)
        except Challenge.DoesNotExist:
            return None

    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_id, *args, **kwargs):
        challenge_instance = self.get_object(challenge_id)
        if not challenge_instance:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChallengeSerializer(challenge_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def put(self, request, challenge_id, *args, **kwargs):
        challenge_instance = self.get_object(challenge_id)
        if not challenge_instance:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'title': request.data.get('title'),
            'start_date': datetime.strptime(request.data.get('start_date').split('T')[0], '%Y-%m-%d').date(),
            'end_date': datetime.strptime(request.data.get('end_date').split('T')[0], '%Y-%m-%d').date()
        }
        serializer = ChallengeSerializer(instance=challenge_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @permission_classes([IsAuthenticated])
    def delete(self, request, challenge_id, *args, **kwargs):
        challenge_instance = self.get_object(challenge_id)
        if not challenge_instance:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_instance.delete()
        return Response(
            {'res': 'Object with challenge id {} deleted'.format(challenge_id)},
            status=status.HTTP_200_OK
        )


class ChallengeSchedulesApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_id, *args, **kwargs):
        try:
            challenge = Challenge.objects.get(challenge_id=challenge_id)
        except ObjectDoesNotExist:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_schedules = ChallengeSchedule.objects.filter(challenge_id=challenge)
        serializer = ChallengeScheduleSerializer(challenge_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChallengeCompletionEntriesApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_id, *args, **kwargs):
        try:
            challenge = Challenge.objects.get(challenge_id=challenge_id)
        except ObjectDoesNotExist:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_completion_entries = ChallengeCompletionEntry.objects.filter(challenge_schedule_id__challenge_id=challenge)
        serializer = ChallengeCompletionEntrySerializer(challenge_completion_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChallengeSummaryApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_id, *args, **kwargs):
        try:
            challenge = Challenge.objects.get(challenge_id=challenge_id)
        except ObjectDoesNotExist:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_id)},
                status=status.HTTP_400_BAD_REQUEST
            )

        challenge_schedules = ChallengeSchedule.objects.filter(challenge_id=challenge)

        # Result structure passed into the HTTP response at the end:
        result = {'headers': [], 'body': []}

        # Get the participating users:
        users = OrderedDict()
        for schedule in challenge_schedules:
            users[schedule.user_id.id] = schedule.user_id.username
        result['headers'] = ['date'] + [value for _, value in users.items()]

        logger.info('Creating summary for users: %s', users)

        # Generate the days of the challenge:
        no_of_days = (challenge.end_date - challenge.start_date).days + 1
        logger.info('Challenge summary start and end dates: %s - %s, delta: %s', challenge.start_date,
                    challenge.end_date, no_of_days)
        date_entries = OrderedDict()
        for n in range(no_of_days):
            date_str = str(challenge.start_date + timedelta(days=n))
            date_entries[date_str] = OrderedDict()
            for _, name in users.items():
                date_entries[date_str][name] = OrderedDict()

        logger.debug('Date entries: %s', date_entries)

        for schedule in challenge_schedules:
            username = schedule.user_id.username
            ch_type = schedule.challenge_type_id.name

            # Basic data: no. of days FROM schedule start date TO challenge end date
            no_of_days = (challenge.end_date - schedule.start_date).days + 1
            # Target per day based on the total number of days available in the schedule/day frequency + the total goal:
            target_per_day = schedule.total_goal / int((no_of_days / schedule.day_frequency))
            logger.debug('%s %s %s %s %s %s', username, schedule.start_date, schedule.day_frequency, no_of_days,
                         schedule.total_goal, target_per_day)

            # Adding the target entries based on the day frequency:
            date_delta = timedelta(days=schedule.day_frequency)
            d = schedule.start_date
            while d <= challenge.end_date:
                d_str = str(d)
                if ch_type not in date_entries[d_str][username]:
                    date_entries[d_str][username][ch_type] = OrderedDict()
                date_entries[d_str][username][ch_type]['target'] = target_per_day
                date_entries[d_str][username][ch_type]['unit'] = schedule.challenge_type_id.unit
                d = d + date_delta

            # Adding the completion entries:
            completion_entries = ChallengeCompletionEntry.objects.filter(challenge_schedule_id=schedule)
            for entry in completion_entries:
                date_str = str(entry.timestamp.date())
                if 'completion' not in date_entries[date_str][username][ch_type]:
                    date_entries[date_str][username][ch_type]['completion'] = 0.0
                current = date_entries[date_str][username][ch_type]['completion']
                date_entries[date_str][username][ch_type]['completion'] = current + entry.amount

        logger.debug('Date entries: %s', date_entries)

        for date_str, value in date_entries.items():
            value['date'] = date_str
            result['body'].append(value)

        logger.debug('Result: %s', result)

        return Response({'res': result}, status=status.HTTP_200_OK)
