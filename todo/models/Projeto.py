from django.db import models
from django.contrib.auth.models import User

class Projeto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    dono = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projetos')
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome