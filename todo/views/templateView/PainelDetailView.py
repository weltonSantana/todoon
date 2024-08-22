from django.views.generic import TemplateView, DetailView

from todo.models import Projeto

class PainelDetailView(DetailView):
  model = Projeto
  template_name = "includes/painel.html"