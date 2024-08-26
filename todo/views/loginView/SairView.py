from django.contrib.auth.views import LogoutView
from django.urls import reverse_lazy

class SairView(LogoutView):
    next_page = reverse_lazy('login') 

    
