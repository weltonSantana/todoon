from django.db import models
from todo.models import Projeto

class Lista(models.Model):
    nome = models.CharField(max_length=255)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='listas')
    ordem = models.PositiveIntegerField(default=0)  
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome