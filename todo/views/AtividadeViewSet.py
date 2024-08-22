from rest_framework import viewsets
from todo.models import Atividade
from todo.serializers.AtividadeSerializer import AtividadeSerializer

class AtividadeViewSet(viewsets.ModelViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer