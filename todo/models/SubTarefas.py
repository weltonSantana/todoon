from django.db import models
from todo.models import Tarefas

class SubTarefas(models.Model):
    tarefas = models.ForeignKey(Tarefas, verbose_name="Tarefas", on_delete=models.CASCADE, related_name='subtasks')
    titulo = models.CharField(verbose_name="Titulo",max_length=200)
    completado = models.BooleanField(verbose_name="Completado?",default=False)
    dataVencimento = models.DateTimeField(verbose_name="Data de Vencimento", null=True, blank=True)

    def __str__(self):
        return f"{self.titulo} (SubTarefa de {self.task.titulo})"