from rest_framework import viewsets, status
from todo.models import Projeto, Quadro
from todo.serializers import QuadroSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class QuadroViewSet(viewsets.ModelViewSet):
    queryset = Quadro.objects.all()
    serializer_class = QuadroSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        term = kwargs.get('pk')
        Quadro = Quadro.objects.filter(id=term)
        print(f'Kwargs: {kwargs}')
            
        Quadro_serialized = QuadroSerializer(Quadro, many=True)
        responseData = Quadro_serialized.data
        
        return Response(responseData,status=status.HTTP_200_OK)
    
    def create(self, request):
        data = request.data
        projetoId = data.get('projeto')
        

        novoQuadro = Quadro(
            nome=data.get('nome'),
            projeto=Projeto.objects.get(id=projetoId),
        )
        
        novoQuadro.save()
        Quadro_serialized = QuadroSerializer(novoQuadro)
        return Response(Quadro_serialized.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        data = request.data
        try:
            Quadro = Quadro.objects.get(id=pk)
        except Quadro.DoesNotExist:
            return Response({'mensagem': 'Quadro não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        Quadro.nome = data.get('nome', Quadro.nome)
        Quadro.descricao =  Projeto.objects.get(id=data.get('projeto')) if data.get('projeto') else Quadro.projeto
        Quadro.save()

        Quadro_serialized = QuadroSerializer(Quadro)
        return Response(Quadro_serialized.data, status=status.HTTP_200_OK)
    