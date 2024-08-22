from django.db import models
from todo.models import Lista
from django.contrib.auth.models import User

class Cartao(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    lista = models.ForeignKey(Lista, on_delete=models.CASCADE, related_name='cartoes')
    ordem = models.PositiveIntegerField(default=0) 
    dataVencimento = models.DateTimeField(null=True, blank=True)
    etiquetas = models.ManyToManyField('Etiqueta', blank=True, related_name='cartoes')
    atribuidoA = models.ManyToManyField(User, blank=True, related_name='cartoes')
    dataCriacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
    
class Etiqueta(models.Model):
    nome = models.CharField(max_length=50)
    cor = models.CharField(max_length=7)  

    def __str__(self):
        return self.nome
    