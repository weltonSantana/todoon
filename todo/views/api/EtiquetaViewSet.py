from rest_framework import viewsets
from todo.models import Etiqueta
from todo.serializers import EtiquetaSerializer
from django.contrib.auth.mixins import LoginRequiredMixin


class EtiquetaViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    