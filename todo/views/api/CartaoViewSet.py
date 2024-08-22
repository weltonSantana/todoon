from rest_framework import viewsets
from todo.models import Cartao
from todo.serializers import CartaoSerializer

class CartaoViewSet(viewsets.ModelViewSet):
    queryset = Cartao.objects.all()
    serializer_class = CartaoSerializer