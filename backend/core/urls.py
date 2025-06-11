from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet
from .views import *

router = DefaultRouter()
router.register(r"profiles", ProfileViewSet)
router.register(r"departamentos", DepartamentoViewSet)
router.register(r"facultades", FacultadViewSet)
router.register(r"proveedores", ProveedorTelefonoViewSet)
router.register(r"anexos", AnexoViewSet, basename="anexos")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("calculo-reportes/calculo-unidad/", generar_calculo_unidad),
    path("calculo-reportes/generar-calculo-general/", generar_calculo_general),
    path("reportes/", listar_reportes),
    path("reportes/<int:pk>/descargar/", descargar_reporte),
    path('reporte/<int:pk>/', eliminar_reporte),
    path('trafico/', trafico_por_proveedor_mes),
]
