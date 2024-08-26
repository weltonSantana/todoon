from django.views.generic import TemplateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin

from todo.models import Projeto, Cartao

class PainelDetailView(LoginRequiredMixin, DetailView):
  model = Projeto
  template_name = "includes/painel.html"
  
  
  def get_context_data(self, **kwargs):
      context = super().get_context_data(**kwargs)
      
      pk = self.kwargs.get('pk')
      print(pk)
      print(Cartao.objects.filter(lista__projeto__id=pk))
      context["dadosCartao"] = Cartao.objects.filter(lista__projeto__id=pk)
      return context
  