from django.urls import include, path
from rest_framework.routers import DefaultRouter
from todo.views import SubTarefasViewSet, TarefasViewSet 

router = DefaultRouter(trailing_slash=False)
router.register(r'tarefas', TarefasViewSet)
router.register(r'subtarefas', SubTarefasViewSet)
# router.register(r'',)
urlpatterns = [
  path('', include(router.urls)),
]