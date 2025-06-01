from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet
from .views import *
from .views import generar_calculo_unidad,generar_calculo_general

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'facultades', FacultadViewSet)
router.register(r'proveedores', ProveedorTelefonoViewSet) 
router.register(r'anexos', AnexoViewSet, basename='anexos')

urlpatterns=[
    path('',include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('calculo-reportes/calculo-unidad/', generar_calculo_unidad),
    path('calculo-reportes/generar-calculo-general/', generar_calculo_general),
]