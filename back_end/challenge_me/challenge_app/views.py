from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import Challenge
from .serializers import ChallengeSerializer


class ChallengeListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
        challenges = Challenge.objects.all()
        serializer = ChallengeSerializer(challenges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        data = {
            'title': request.data.get('title'),
            'start_date': datetime.strptime(request.data.get('startDate').split('T')[0], '%Y-%m-%d').date(),
            'end_date': datetime.strptime(request.data.get('endDate').split('T')[0], '%Y-%m-%d').date()
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
                {"res": "Object with challenge id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChallengeSerializer(challenge_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def put(self, request, challenge_id, *args, **kwargs):
        challenge_instance = self.get_object(challenge_id)
        if not challenge_instance:
            return Response(
                {"res": "Object with challenge id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'title': request.data.get('title'),
            'start_date': request.data.get('start_date'),
            'end_date': request.data.get('start_date')
        }
        serializer = ChallengeSerializer(instance=challenge_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @permission_classes([IsAuthenticated])
    def delete(self, request, challenge_id, *args, **kwargs):
        challenge_instance = self.get_object(challenge_id, request.user.id)
        if not challenge_instance:
            return Response(
                {"res": "Object with challenge id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )
