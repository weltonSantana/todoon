from rest_framework import serializers
from todo.models import Lista
from todo.serializers.QuadroSerializer import QuadroSerializer

class ListaSerializer(serializers.ModelSerializer):
    quadro = QuadroSerializer(read_only=True)

    class Meta:
        model = Lista
        fields = "__all__"