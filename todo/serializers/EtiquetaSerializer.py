from rest_framework import serializers
from todo.models import  Etiqueta
        
class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = "__all__"