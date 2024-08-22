from rest_framework import viewsets
from todo.models import Lista
from todo.serializers import ListaSerializer

class ListaViewSet(viewsets.ModelViewSet):
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer