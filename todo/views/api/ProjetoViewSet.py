from rest_framework import viewsets, status
from todo.models import Projeto
from todo.serializers import ProjetoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin


class ProjetoViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        term = kwargs.get('pk')
        projeto = Projeto.objects.filter(id=term)
        print(f'Kwargs: {kwargs}')
            
        projeto_serialized = ProjetoSerializer(projeto, many=True)
        responseData = projeto_serialized.data
        
        return Response(responseData,status=status.HTTP_200_OK)
    
    def destroy(request, *args, **kwargs):
        term = kwargs.get('pk')
        projeto = Projeto.objects.get(id=term)
        projeto.delete()
        status = 200
        return Response(status=status)
    
    def create(self, request):
        data = request.data

        novoProjeto = Projeto(
            nome=data.get('nome'),
            descricao=data.get('descricao'),
            dono=request.user,
        )
        
        novoProjeto.save()
        
        projeto_serialized = ProjetoSerializer(novoProjeto)
        return Response(projeto_serialized.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        data = request.data
        try:
            projeto = Projeto.objects.get(id=pk)
        except Projeto.DoesNotExist:
            return Response({'mensagem': 'projeto não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        projeto.nome = data.get('nome', projeto.nome)
        projeto.descricao = data.get('descricao', projeto.descricao)
        projeto.dono = request.user
        projeto.save()

        projeto_serialized = ProjetoSerializer(projeto)
        return Response(projeto_serialized.data, status=status.HTTP_200_OK)
    