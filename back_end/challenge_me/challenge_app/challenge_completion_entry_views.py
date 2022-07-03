import logging
from dateutil import parser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import (
    ChallengeCompletionEntry,
    ChallengeSchedule
)
from .serializers import ChallengeCompletionEntrySerializer

logger = logging.getLogger('django')


class ChallengeCompletionEntryListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
        challenge_completion_entries = ChallengeCompletionEntry.objects.all()
        serializer = ChallengeCompletionEntrySerializer(challenge_completion_entries, many=True)
        logger.info('Retrieved %s challenge completion entries', len(serializer.data))
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        # TODO(laszlzso): this is disgusting, find a better way please
        challenge_schedule_id = int(request.data.get('challenge_schedule_id'))
        challenge_schedule = ChallengeSchedule.objects.get(challenge_schedule_id=challenge_schedule_id)
        field_object = ChallengeSchedule._meta.get_field('user_id')
        field_value = field_object.value_from_object(challenge_schedule) if challenge_schedule else None
        if self.request.user.id != field_value:
            # TODO(ricsi): change all error messages to align with UI
            return Response({'non_field_errors': ['You are not allowed to add completion entries for other users']},
                            status=status.HTTP_403_FORBIDDEN)

        # TODO(laszlzso): try passing this directly
        request_datetime = parser.parse(request.data.get('timestamp', ''), yearfirst=True)
        data = {
            'challenge_schedule_id': request.data.get('challenge_schedule_id'),
            'timestamp': str(request_datetime.date()) + 'T' + str(request_datetime.time()),
            'amount': float(request.data.get('amount'))
        }
        serializer = ChallengeCompletionEntrySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChallengeCompletionEntryApiView(APIView):
    def get_object(self, challenge_completion_entry_id):
        try:
            return ChallengeCompletionEntry.objects.get(challenge_completion_entry_id=challenge_completion_entry_id)
        except ChallengeCompletionEntry.DoesNotExist:
            return None

    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_completion_entry_id, *args, **kwargs):
        challenge_completion_entry = self.get_object(challenge_completion_entry_id)
        if not challenge_completion_entry:
            return Response(
                {'res': 'Object with challenge completion entry id {} does not exist'.format(
                    challenge_completion_entry_id)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChallengeCompletionEntrySerializer(challenge_completion_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO(laszlzso): fix permission issue/disable method.
    @permission_classes([IsAuthenticated])
    def put(self, request, challenge_completion_entry_id, *args, **kwargs):
        challenge_completion_entry = self.get_object(challenge_completion_entry_id)
        self.check_object_permissions(self.request, challenge_completion_entry)
        if not challenge_completion_entry:
            return Response(
                {'res': 'Object with challenge completion entry id {} does not exist'.format(
                    challenge_completion_entry_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        request_datetime = parser.parse(request.data.get('timestamp', ''), yearfirst=True)
        data = {
            'challenge_schedule_id': request.data.get('challenge_schedule_id'),
            'timestamp': str(request_datetime.date()) + 'T' + str(request_datetime.time()),
            'amount': float(request.data.get('amount'))
        }
        serializer = ChallengeCompletionEntrySerializer(instance=challenge_completion_entry, data=data,
                                                        partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # TODO(laszlzso): fix permission issue/disable method.
    @permission_classes([IsAuthenticated])
    def delete(self, request, challenge_completion_entry_id, *args, **kwargs):
        challenge_completion_entry = self.get_object(challenge_completion_entry_id)
        self.check_object_permissions(self.request, challenge_completion_entry)
        if not challenge_completion_entry:
            return Response(
                {'res': 'Object with challenge completion entry id {} does not exists'.format(
                    challenge_completion_entry_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_completion_entry.delete()
        return Response(
            {'res': 'Object with challenge completion entry id {} deleted'.format(challenge_completion_entry_id)},
            status=status.HTTP_200_OK
        )
