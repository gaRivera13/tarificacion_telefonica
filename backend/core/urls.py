from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet
from .views import *

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'facultades', FacultadViewSet)
router.register(r'proveedores', ProveedorTelefonoViewSet) 
router.register(r'anexos', AnexoViewSet, basename='anexos')

urlpatterns=[
    path('',include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    # path('subir-anexo/', AnexoUploadView.as_view(), name='subir_anexo'),  
    # path('anexos/', AnexoListView.as_view(), name='listar_anexos'),
]