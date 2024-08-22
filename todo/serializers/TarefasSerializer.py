from rest_framework import serializers
from todo.models import Tarefas

class TarefasSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tarefas
        fields = "__all__"