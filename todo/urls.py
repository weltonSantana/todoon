from django.urls import include, path
from rest_framework.routers import DefaultRouter
from todo.views import ProjetoViewSet, QuadroViewSet, ListaViewSet, CartaoViewSet, EtiquetaViewSet, AtividadeViewSet, ListaMembrosViewSet, IndexTemplateView, PainelDetailView, CustomLoginView, SairView, chat_room

router = DefaultRouter(trailing_slash=False)
router.register(r'projetos', ProjetoViewSet)
router.register(r'membros', ListaMembrosViewSet)
router.register(r'quadros', QuadroViewSet)
router.register(r'listas', ListaViewSet)
router.register(r'cartoes', CartaoViewSet)
router.register(r'etiquetas', EtiquetaViewSet)
router.register(r'atividades', AtividadeViewSet)

urlpatterns = [
  path('api/', include(router.urls)),
  path('', IndexTemplateView.as_view(), name='index'),
  path('projeto/visualizar/<int:pk>', PainelDetailView.as_view(), name='painel'),
  path('login/', CustomLoginView.as_view(), name='login'),
  path('sair/', SairView.as_view(), name='sair'),
  path('chat/<str:room_name>/', chat_room, name='chat_room'),
]