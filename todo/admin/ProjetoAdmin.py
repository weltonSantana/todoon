from django.contrib import admin
#######
from todo.models import Projeto

@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ('nome', )
    search_fields = ('nome',)