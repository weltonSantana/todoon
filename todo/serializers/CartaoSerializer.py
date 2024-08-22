from rest_framework import serializers
from todo.models import Cartao, Etiqueta
from todo.serializers.EtiquetaSerializer import EtiquetaSerializer
from todo.serializers.ListaSerializer import ListaSerializer
from todo.serializers.ProjetoSerializer import UsuarioSerializer

class CartaoSerializer(serializers.ModelSerializer):
    lista = ListaSerializer(read_only=True)
    etiquetas = EtiquetaSerializer(many=True, read_only=True)
    atribuidoA = UsuarioSerializer(many=True, read_only=True)

    class Meta:
        model = Cartao
        fields = "__all__"
        
