from rest_framework import viewsets, status
from todo.models import Cartao, Lista
from todo.serializers import CartaoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin


class CartaoViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Cartao.objects.all()
    serializer_class = CartaoSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        lista_id = self.request.query_params.get('lista')
        if lista_id:
            return Cartao.objects.filter(lista_id=lista_id)
        return super().get_queryset()
    
    
    def retrieve(self, request, *args, **kwargs):
        term = kwargs.get('pk')
        cartao = Cartao.objects.filter(id=term)
        print(f'Kwargs: {kwargs}')
            
        cartao_serialized = CartaoSerializer(cartao, many=True)
        responseData = cartao_serialized.data
        
        return Response(responseData,status=status.HTTP_200_OK)
    
    def destroy(request, *args, **kwargs):
        term = kwargs.get('pk')
        cartao = Cartao.objects.get(id=term)
        cartao.delete()
        status = 200
        return Response(status=status)
    
    def create(self, request):
        data = request.data
        listaId = data.get('lista')
        titulo = data.get('titulo')
        
        if not titulo or titulo.strip() == '':
            return Response({'error': 'O título é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lista = Lista.objects.get(id=listaId)
        except Lista.DoesNotExist:
            return Response({'error': 'A lista especificada não existe.'}, status=status.HTTP_404_NOT_FOUND)

        novoCartao = Cartao(
            titulo=titulo,
            descricao=data.get('descricao'),
            lista=lista
        )
        novoCartao.save()
        
        cartao_serialized = CartaoSerializer(novoCartao)
        return Response(cartao_serialized.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        data = request.data
        try:
            cartao = Cartao.objects.get(id=pk)
        except Cartao.DoesNotExist:
            return Response({'mensagem': 'cartão não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        cartao.titulo = data.get('titulo', cartao.titulo)
        cartao.descricao = data.get('descricao', cartao.descricao)
        cartao.ordem = data.get('ordem', cartao.ordem)
        cartao.lista = Lista.objects.get(id=data.get('lista')) if data.get('lista') else cartao.lista
        
        if 'etiquetas' in data:
            cartao.etiquetas.set(data['etiquetas']) 
            
        cartao.save()

        cartao_serialized = CartaoSerializer(cartao)
        return Response(cartao_serialized.data, status=status.HTTP_200_OK)
    