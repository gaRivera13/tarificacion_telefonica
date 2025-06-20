import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from core.models import (
    ProveedorTelefono,
    Facultad,
    Departamento,
    Profile,
    Anexo,
    RegistroLlamadas,
    CalculoMensualDepto,
    CalculoMensualGeneral,
    Notificacion,
    ReporteGenerado,
)

ProveedorTelefono.objects.all().delete()
Facultad.objects.all().delete()
Departamento.objects.all().delete()
Profile.objects.all().delete()
Anexo.objects.all().delete()
RegistroLlamadas.objects.all().delete()
CalculoMensualDepto.objects.all().delete()
CalculoMensualGeneral.objects.all().delete()
Notificacion.objects.all().delete()
ReporteGenerado.objects.all().delete()

entel = ProveedorTelefono.objects.create(
    siglas_proveedor="CEL",
    nombre_proveedor="Entel",
    costo_seg_cel=100,
    costo_seg_slm=200,
    costo_seg_ldi=300,
)
movistar = ProveedorTelefono.objects.create(
    siglas_proveedor="SLM",
    nombre_proveedor="Movistar",
    costo_seg_cel=400,
    costo_seg_slm=300,
    costo_seg_ldi=600,
)

facu1 = Facultad.objects.create(
    nombre_facultad="Ingeniería", siglas_facultad="ING", id_proveedor=movistar
)
facu2 = Facultad.objects.create(
    nombre_facultad="Salud", siglas_facultad="FS", id_proveedor=entel
)

dep1 = Departamento.objects.create(
    nombre_depto="Informática", siglas_depto="INF", id_facultad=facu1
)
dep2 = Departamento.objects.create(
    nombre_depto="Biología", siglas_depto="BIO", id_facultad=facu2
)

Profile.objects.create(
    nombre="Carlos",
    s_nombre="Eduardo",
    apellido_p="Gómez",
    apellido_m="López",
    correo="carlosgomez@gmail.com",
    id_facultad=facu1,
    id_unidad=dep1,
    username="cgomez",
    password="pass1234",
    rol="admin",
)

Profile.objects.create(
    nombre="María",
    s_nombre="Isabel",
    apellido_p="Pérez",
    apellido_m="Soto",
    correo="mariaperez@gmail.com",
    id_facultad=facu1,
    id_unidad=dep1,
    username="mperez",
    password="clave5678",
    rol="encargado",
)

print("Datos poblados correctamente.")
