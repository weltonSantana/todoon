from rest_framework import viewsets, status
from todo.models import ListaMembros, ListaMembros, Projeto
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from todo.serializers.ListaMembrosSerializer import ListaMembrosSerializer
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated


class ListaMembrosViewSet(LoginRequiredMixin,viewsets.ModelViewSet):
    queryset = ListaMembros.objects.all()
    serializer_class = ListaMembrosSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        term = kwargs.get('pk')
        listaMembros = ListaMembros.objects.filter(projeto__id=term)
        print(f'Kwargs: {kwargs}')
            
        listaMembros_serialized = ListaMembrosSerializer(listaMembros, many=True)
        responseData = listaMembros_serialized.data
        
        return Response(responseData,status=status.HTTP_200_OK)
    
    def destroy(request, *args, **kwargs):
        term = kwargs.get('pk')
        listaMembros = ListaMembros.objects.get(id=term)
        listaMembros.delete()
        status = 200
        return Response(status=status)
    
    def create(self, request):
        data = request.data
        listaMembro = ListaMembros()
        
        listaMembro.membro = User.objects.get(id=data.get('membro'))
        listaMembro.projeto = Projeto.objects.get(id=data.get('projeto'))

        if ListaMembros.objects.filter(membro__id=data.get('membro'),    projeto__id=data.get('projeto')).exists():
            return Response({'mensagem': 'Membro já convidado!'}, status=400)
  
        listaMembro.save()
        
        listaMembros_serialized = ListaMembrosSerializer([listaMembro], many=True)
        responseData = listaMembros_serialized.data
        return Response(responseData, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        data = request.data
        try:
            listaMembros = ListaMembros.objects.get(id=pk)
        except listaMembros.DoesNotExist:
            return Response({'mensagem': 'Membro não encontrado!'}, status=status.HTTP_404_NOT_FOUND)

        listaMembros.membro = User.objects.get(id=data.get('membro')) if data.get('membro') else listaMembros.membro
        listaMembros.projeto =  Projeto.objects.get(id=data.get('projeto')) if data.get('projeto') else listaMembros.projeto
        listaMembros.save()

        listaMembros_serialized = ListaMembrosSerializer(listaMembros)
        responseData = listaMembros_serialized.data
        
        return Response(responseData, status=status.HTTP_200_OK)
    