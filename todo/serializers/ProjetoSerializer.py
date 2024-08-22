from rest_framework import serializers
from todo.models import Projeto
from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        
class ProjetoSerializer(serializers.ModelSerializer):
    dono = UsuarioSerializer(read_only=True)
  
    class Meta:
        model = Projeto
        fields = "__all__"