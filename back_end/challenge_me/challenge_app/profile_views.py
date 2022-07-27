from django import forms
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileImageSerializer


class ImageUploadForm(forms.Form):
    image = forms.FileField()


class ProfileImageListApiView(APIView):
    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            data = {
                'user_id': self.request.user.id,
                'image': request.FILES['image']
            }
            image = ProfileImageSerializer(data=data)
            if image.is_valid():
                image.save()
                return Response(status=status.HTTP_201_CREATED)
            return Response(image.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
