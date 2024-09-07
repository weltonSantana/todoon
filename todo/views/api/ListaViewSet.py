from todo.models import Lista, Projeto
from todo.serializers import ListaSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response

class ListaViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = Lista.objects.all()
    serializer_class = ListaSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        projeto_id = self.request.query_params.get('projeto', None)
        if projeto_id:
            return self.queryset.filter(projeto_id=projeto_id).order_by('ordem')
        return self.queryset
    
    
    def create(self, request):
        data = request.data
        
        novaLista = Lista(
            nome=data.get('nome'),
            projeto=Projeto.objects.get(id=data.get('projeto')),
        )
        
        novaLista.save()
        lista_serialized = ListaSerializer(novaLista)
        return Response(lista_serialized.data, status=status.HTTP_201_CREATED)
    
    
    
    def update(self, request, pk=None):
        data = request.data
        try:
            lista = Lista.objects.get(id=pk)
        except Lista.DoesNotExist:
            return Response({'mensagem': 'Lista não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        lista.nome = data.get('nome', lista.nome)
        lista.ordem = data.get('ordem', lista.ordem)
        lista.save()

        lista_serialized = ListaSerializer(lista)
        return Response(lista_serialized.data, status=status.HTTP_200_OK)
    
    