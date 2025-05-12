from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet, LoginView, ProveedorTelefonoViewSet


router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

router.register(r'departamentos', DepartamentoViewSet)

router.register(r'facultades', FacultadViewSet)
router.register(r'proveedores', ProveedorTelefonoViewSet) 

urlpatterns=[
    path('core/',include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]