from django import forms
from django.contrib.auth.forms import AuthenticationForm

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Usuário', widget=forms.TextInput(attrs={'class': 'dark:bg-[#3b3b3b] input input-bordered w-full', 'placeholder': 'Digite seu nome de usuário'}))
    password = forms.CharField(label='Senha', widget=forms.PasswordInput(attrs={'class': 'dark:bg-[#3b3b3b] input input-bordered w-full', 'placeholder': 'Digite sua senha'}))
