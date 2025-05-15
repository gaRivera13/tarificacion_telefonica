from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet
from .views import LoginView, ProveedorTelefonoViewSet, AnexoViewSet

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

router.register(r'departamentos', DepartamentoViewSet)
router.register(r'facultades', FacultadViewSet)
router.register(r'proveedores', ProveedorTelefonoViewSet) 
router.register(r'anexos', AnexoViewSet)

urlpatterns=[
    path('core/',include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]