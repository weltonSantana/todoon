from rest_framework import serializers
from todo.models import ListaMembros
from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', ] 
        
class ListaMembrosSerializer(serializers.ModelSerializer):
    membros = UsuarioSerializer()

    class Meta:
        model = ListaMembros
        fields = "__all__"