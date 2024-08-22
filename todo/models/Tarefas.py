from django.db import models
from django.contrib.auth.models import User

class Tarefas(models.Model):
    PRIORITY_CHOICES = [
        ('L', 'Baixo'),
        ('M', 'Médio'),
        ('H', 'Alto'),
    ]

    titulo = models.CharField(verbose_name="Titulo", max_length=200)
    descricao = models.TextField(verbose_name="Descrição",blank=True, null=True)
    dataCriacao = models.DateTimeField(verbose_name="Data de Criação", auto_now_add=True)
    dataVencimento = models.DateTimeField(verbose_name="Data de Vencimento", null=True, blank=True)
    completo = models.BooleanField(verbose_name="Completado?",default=False)
    prioridade = models.CharField(verbose_name="Prioridade",max_length=1, choices=PRIORITY_CHOICES, default='M')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tarefas')

    def __str__(self):
        return self.titulo
