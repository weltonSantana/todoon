from rest_framework import viewsets
from todo.models import Atividade
from todo.serializers.AtividadeSerializer import AtividadeSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated


class AtividadeViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    permission_classes = [IsAuthenticated]