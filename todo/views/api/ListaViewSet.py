from rest_framework import viewsets
from todo.models import Lista
from todo.serializers import ListaSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated


class ListaViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        projeto_id = self.request.query_params.get('projeto', None)
        if projeto_id:
            return self.queryset.filter(projeto_id=projeto_id).order_by('ordem')
        return self.queryset