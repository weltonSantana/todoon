from rest_framework import viewsets
from todo.models import Etiqueta
from todo.serializers import EtiquetaSerializer

class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer