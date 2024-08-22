from django.db import models
from django.contrib.auth.models import User

from todo.models import Projeto

class ListaMembros(models.Model):
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, verbose_name="Projeto")
    membros = models.ForeignKey(User, on_delete=models.CASCADE, related_name='membros_projeto')
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.projeto)