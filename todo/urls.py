from django.urls import include, path
from rest_framework.routers import DefaultRouter
from todo.views import ProjetoViewSet, QuadroViewSet, ListaViewSet, CartaoViewSet, EtiquetaViewSet, AtividadeViewSet, ListaMembrosViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'projetos', ProjetoViewSet)
router.register(r'membros', ListaMembrosViewSet)
router.register(r'quadros', QuadroViewSet)
router.register(r'listas', ListaViewSet)
router.register(r'cartoes', CartaoViewSet)
router.register(r'etiquetas', EtiquetaViewSet)
router.register(r'atividades', AtividadeViewSet)

urlpatterns = [
  path('', include(router.urls)),
]