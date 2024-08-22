from rest_framework import serializers
from todo.models import SubTarefas 

class SubTarefasSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubTarefas
        fields = "__all__"