import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import ChallengeType
from .serializers import ChallengeTypeSerializer

logger = logging.getLogger('django')


class ChallengeTypeListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
        challenge_types = ChallengeType.objects.all()
        serializer = ChallengeTypeSerializer(challenge_types, many=True)
        logger.info('Retrieved %s challenge type entries', len(serializer.data))
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        serializer = ChallengeTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChallengeTypeApiView(APIView):
    def get_object(self, challenge_type_id):
        try:
            return ChallengeType.objects.get(challenge_type_id=challenge_type_id)
        except ChallengeType.DoesNotExist:
            return None

    @permission_classes([IsAuthenticated])
    def get(self, request, challenge_type_id, *args, **kwargs):
        challenge_type_instance = self.get_object(challenge_type_id)
        if not challenge_type_instance:
            return Response(
                {'res': 'Object with challenge type id {} does not exist'.format(challenge_type_id)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ChallengeTypeSerializer(challenge_type_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @permission_classes([IsAuthenticated])
    def put(self, request, challenge_type_id, *args, **kwargs):
        challenge_type_instance = self.get_object(challenge_type_id)
        if not challenge_type_instance:
            return Response(
                {"res": "Object with challenge type id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ChallengeTypeSerializer(instance=challenge_type_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @permission_classes([IsAuthenticated])
    def delete(self, request, challenge_type_id, *args, **kwargs):
        challenge_type_instance = self.get_object(challenge_type_id, request.user.id)
        if not challenge_type_instance:
            return Response(
                {"res": "Object with challenge type id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        challenge_type_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )
