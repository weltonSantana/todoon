from django.db import models
from todo.models import Cartao
from django.contrib.auth.models import User

class Atividade(models.Model):
    cartao = models.ForeignKey(Cartao, on_delete=models.CASCADE, related_name='atividades')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='atividades')
    descricao = models.TextField()
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.descricao}"