from rest_framework import viewsets, status
from todo.models import Projeto, Lista
from todo.serializers import ProjetoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin


class ProjetoViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Projeto.objects.filter(dono=user)

    def retrieve(self, request, *args, **kwargs):
        term = kwargs.get('pk')
        user = request.user

        try:
            projeto = Projeto.objects.get(id=term, dono=user)
        except Projeto.DoesNotExist:
            return Response({'mensagem': 'Projeto não encontrado ou você não tem permissão para visualizar.'}, status=status.HTTP_404_NOT_FOUND)

        projeto_serialized = ProjetoSerializer(projeto)
        responseData = projeto_serialized.data
        
        return Response(responseData, status=status.HTTP_200_OK)
    
    def destroy(request, *args, **kwargs):
        term = kwargs.get('pk')
        projeto = Projeto.objects.get(id=term)
        projeto.delete()
        status = 200
        return Response(status=status)
    
    
    def create(self, request):
        data = request.data
        
        nome = data.get('nome')
        
        if not nome or nome.strip() == '':
            return Response({'error': 'O Nome é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        novoProjeto = Projeto(
            nome=nome,
            descricao=data.get('descricao'),
            dono=request.user,
        )
        
        novoProjeto.save()

        listas_padrao = [
            {"nome": "Tarefas", "ordem": 1},
            {"nome": "Em andamento", "ordem": 2},
            {"nome": "Concluídas", "ordem": 3},
        ]

        for lista_data in listas_padrao:
            Lista.objects.create(
                nome=lista_data["nome"],
                projeto=novoProjeto,
                ordem=lista_data["ordem"]
            )
        
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
    