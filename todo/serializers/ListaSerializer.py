from rest_framework import serializers
from todo.models import Lista
from todo.serializers.ProjetoSerializer import ProjetoSerializer

class ListaSerializer(serializers.ModelSerializer):
    quadro = ProjetoSerializer(read_only=True)

    class Meta:
        model = Lista
        fields = "__all__"