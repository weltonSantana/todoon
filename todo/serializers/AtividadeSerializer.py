from rest_framework import serializers
from todo.models import Atividade
from todo.serializers.CartaoSerializer import CartaoSerializer
from todo.serializers.ProjetoSerializer import UsuarioSerializer

class AtividadeSerializer(serializers.ModelSerializer):
    cartao = CartaoSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Atividade
        fields = "__all__"