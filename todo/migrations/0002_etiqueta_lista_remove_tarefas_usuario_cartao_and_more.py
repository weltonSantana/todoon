# Generated by Django 5.1 on 2024-08-22 12:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Etiqueta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=50)),
                ('cor', models.CharField(max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Lista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('ordem', models.PositiveIntegerField(default=0)),
                ('dataCriacao', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='tarefas',
            name='usuario',
        ),
        migrations.CreateModel(
            name='Cartao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=255)),
                ('descricao', models.TextField(blank=True, null=True)),
                ('ordem', models.PositiveIntegerField(default=0)),
                ('dataVencimento', models.DateTimeField(blank=True, null=True)),
                ('dataCriacao', models.DateTimeField(auto_now_add=True)),
                ('atribuidoA', models.ManyToManyField(blank=True, related_name='cartoes', to=settings.AUTH_USER_MODEL)),
                ('etiquetas', models.ManyToManyField(blank=True, related_name='cartoes', to='todo.etiqueta')),
                ('lista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartoes', to='todo.lista')),
            ],
        ),
        migrations.CreateModel(
            name='Atividade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.TextField()),
                ('dataCriacao', models.DateTimeField(auto_now_add=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='atividades', to=settings.AUTH_USER_MODEL)),
                ('cartao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='atividades', to='todo.cartao')),
            ],
        ),
        migrations.CreateModel(
            name='Projeto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('descricao', models.TextField(blank=True, null=True)),
                ('dataCriacao', models.DateTimeField(auto_now_add=True)),
                ('dono', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projetos', to=settings.AUTH_USER_MODEL)),
                ('membros', models.ManyToManyField(related_name='membros_projeto', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Quadro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('dataCriacao', models.DateTimeField(auto_now_add=True)),
                ('projeto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quadros', to='todo.projeto')),
            ],
        ),
        migrations.AddField(
            model_name='lista',
            name='quadro',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listas', to='todo.quadro'),
        ),
        migrations.DeleteModel(
            name='SubTarefas',
        ),
        migrations.DeleteModel(
            name='Tarefas',
        ),
    ]
