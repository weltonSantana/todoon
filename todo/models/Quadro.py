from django.db import models
from todo.models import Projeto

class Quadro(models.Model):
    nome = models.CharField(max_length=255)
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='quadros')
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome
    
