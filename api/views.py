# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class HealthCheckView(APIView):
    """
    Проверка работоспособности API.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"status": "ok"})
