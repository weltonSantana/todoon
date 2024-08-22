from rest_framework import viewsets
from todo.models import Tarefas
from todo.serializers import TarefasSerializer

class TarefasViewSet(viewsets.ModelViewSet):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer