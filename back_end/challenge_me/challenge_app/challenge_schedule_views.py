import logging
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import ChallengeSchedule
from .serializers import ChallengeScheduleSerializer

logger = logging.getLogger('django')


class ChallengeScheduleListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
        challenge_schedules = ChallengeSchedule.objects.all()
        serializer = ChallengeScheduleSerializer(challenge_schedules, many=True)
        logger.info('Retrieved %s challenge schedule entries', len(serializer.data))
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        data = {
            'challenge_id': request.data.get('challenge_id'),  # TODO(laszlzso): needs cast?
            'user_id': self.request.user.id,
            'challenge_type_id': request.data.get('challenge_type_id'),
            'total_goal': float(request.data.get('total_goal')),
             'start_date': datetime.strptime(request.data.get('start_date').split('T')[0], '%Y-%m-%d').date(),
            'day_frequency': int(request.data.get('day_frequency'))
        }
        serializer = ChallengeScheduleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChallengeScheduleApiView(APIView):
    def get_object(self, challenge_schedule_id):
        try:
            return ChallengeSchedule.objects.get(challenge_schedule_id=challenge_schedule_id)
        except ChallengeSchedule.DoesNotExist:
            return None

    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_schedule_id, *args, **kwargs):
        challenge_schedule_instance = self.get_object(challenge_schedule_id)
        if not challenge_schedule_instance:
            return Response(
                {'res': 'Object with challenge id {} does not exist'.format(challenge_schedule_id)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChallengeScheduleSerializer(challenge_schedule_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO(laszlzso): fix permission issue/disable method.
    @permission_classes([IsAuthenticated])
    def put(self, request, challenge_schedule_id, *args, **kwargs):
        challenge_schedule_instance = self.get_object(challenge_schedule_id)
        self.check_object_permissions(self.request, challenge_schedule_instance)
        if not challenge_schedule_instance:
            return Response(
                {'res': 'Object with challenge id does not exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # TODO(laszlzso): find out what Django does with Nones (partial update)
        data = {
            'challenge_id': request.data.get('challenge_id'),
            'challenge_type_id': request.data.get('challenge_type_id'),
            'total_goal': float(request.data.get('total_goal')),
            'start_date': datetime.strptime(request.data.get('start_date').split('T')[0], '%Y-%m-%d').date(),
            'day_frequency': int(request.data.get('day_frequency'))
        }
        serializer = ChallengeScheduleSerializer(instance=challenge_schedule_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # TODO(laszlzso): fix permission issue/disable method.
    @permission_classes([IsAuthenticated])
    def delete(self, request, challenge_schedule_id, *args, **kwargs):
        challenge_schedule_instance = self.get_object(challenge_schedule_id)
        self.check_object_permissions(self.request, challenge_schedule_instance)
        if not challenge_schedule_instance:
            return Response(
                {'res': 'Object with challenge completion schedule id {} does not exists'.format(
                    challenge_schedule_id)},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_schedule_instance.delete()
        return Response(
            {'res': 'Object with challenge schedule id {} deleted'.format(challenge_schedule_id)},
            status=status.HTTP_200_OK
        )
