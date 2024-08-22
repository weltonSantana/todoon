from django.db import models
from todo.models import Quadro

class Lista(models.Model):
    nome = models.CharField(max_length=255)
    quadro = models.ForeignKey(Quadro, on_delete=models.CASCADE, related_name='listas')
    ordem = models.PositiveIntegerField(default=0)  
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome