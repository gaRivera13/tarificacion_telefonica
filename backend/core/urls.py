from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, DepartamentoViewSet, FacultadViewSet
from .views import *

notificacion_list = NotificacionViewSet.as_view(
    {
        "get": "list",
    }
)

notificacion_marcar_leido = NotificacionViewSet.as_view(
    {
        "patch": "marcar_como_leida",
    }
)

router = DefaultRouter()
router.register(r"profiles", ProfileViewSet)
router.register(r"departamentos", DepartamentoViewSet)
router.register(r"facultades", FacultadViewSet)
router.register(r"proveedores", ProveedorTelefonoViewSet)
router.register(r"anexos", AnexoViewSet, basename="anexos")
# router.register(r'notificaciones', NotificacionViewSet, basename='notificaciones')

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("calculo-reportes/calculo-unidad/", generar_calculo_unidad),
    path("calculo-reportes/generar-calculo-general/", generar_calculo_general),
    path("reportes/", listar_reportes),
    path("reportes/<int:pk>/descargar/", descargar_reporte),
    path("reporte/<int:pk>/", eliminar_reporte),
    path("notificaciones/<str:correo>/", notificacion_list, name="notificaciones-list"),
    path("notificaciones/marcar/<int:pk>/", notificacion_marcar_leido, name="notificacion-marcar"),
    path("trafico/", trafico_por_proveedor_mes),
    path("recuperar-password-confirm/", recuperar_password_confirm, name="recuperar-password-confirm"),
]
