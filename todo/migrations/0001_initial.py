# Generated by Django 5.1 on 2024-08-22 00:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tarefas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200, verbose_name='Titulo')),
                ('descricao', models.TextField(blank=True, null=True, verbose_name='Descrição')),
                ('dataCriacao', models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')),
                ('dataVencimento', models.DateTimeField(blank=True, null=True, verbose_name='Data de Vencimento')),
                ('completo', models.BooleanField(default=False, verbose_name='Completado?')),
                ('prioridade', models.CharField(choices=[('L', 'Baixo'), ('M', 'Médio'), ('H', 'Alto')], default='M', max_length=1, verbose_name='Prioridade')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tarefas', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SubTarefas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200, verbose_name='Titulo')),
                ('completado', models.BooleanField(default=False, verbose_name='Completado?')),
                ('dataVencimento', models.DateTimeField(blank=True, null=True, verbose_name='Data de Vencimento')),
                ('tarefas', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtasks', to='todo.tarefas', verbose_name='Tarefas')),
            ],
        ),
    ]
