from rest_framework import serializers
from todo.models import Quadro
from todo.serializers.ProjetoSerializer import ProjetoSerializer

class QuadroSerializer(serializers.ModelSerializer):
    projeto = ProjetoSerializer(read_only=True)

    class Meta:
        model = Quadro
        fields = "__all__"