from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy

from todo.forms.LoginForm import LoginForm

class CustomLoginView(LoginView):
    authentication_form = LoginForm
    redirect_authenticated_user = True
    template_name = 'cadastro/login.html'
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, "Login bem-sucedido.")
        return response

    def form_invalid(self, form):
        messages.error(self.request, "Credenciais inválidas. Verifique seu Usuário e Senha.")
        return super().form_invalid(form)

    def get_success_url(self):
        return reverse_lazy('index')
