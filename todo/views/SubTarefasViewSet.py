from rest_framework import viewsets
from todo.models import SubTarefas
from todo.serializers import SubTarefasSerializer

class SubTarefasViewSet(viewsets.ModelViewSet):
    queryset = SubTarefas.objects.all()
    serializer_class = SubTarefasSerializer