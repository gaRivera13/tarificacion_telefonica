import pandas as pd
from .models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.db.models import Sum, Q
from django.shortcuts import get_object_or_404
import openpyxl
from openpyxl import Workbook
from django.conf import settings
import os
from django.core.files import File
from io import BytesIO
from django.core.files.base import ContentFile



def procesar_archivo_excel(anexo_id):
    anexo = get_object_or_404(Anexo, id_anexo=anexo_id)
    archivo_ruta = anexo.archivo.path

    df = pd.read_excel(archivo_ruta)

    for _, fila in df.iterrows():
        proveedor = get_object_or_404(
            ProveedorTelefono, nombre_proveedor=fila["nombre_proveedor"]
        )
        facultad = get_object_or_404(Facultad, siglas_facultad=fila["siglas_facultad"])
        departamento = get_object_or_404(
            Departamento, siglas_depto=fila["siglas_depto"]
        )

        # Crear un nuevo registro de llamada
        RegistroLlamadas.objects.create(
            id_anexo=anexo,
            id_facultad=facultad,
            id_unidad=departamento,
            id_proveedor=proveedor,
            tipo_llamada_sigla=fila["tipo_llamada_sigla"],
            numero_telefono=fila["numero_telefono"],
            fecha_llamada=fila["fecha_llamada"],
            hora_llamada=datetime.strptime(
                str(fila["hora_llamada"]), "%H:%M:%S"
            ).time(),
            duracion_llamada=int(fila["duracion_llamada"]),
            tipo_respuesta=fila["tipo_respuesta"],
            nombre_destinatario=fila["nombre_destinatario"],
        )


def crear_excel_reporte(datos, nombre_archivo):
    wb = Workbook()
    ws = wb.active
    ws.title = "Reporte"

    ws.append([
        "Nombre cálculo",
        "Fecha",
        "Facultad",
        "Departamento",
        "Duración SLM",
        "Duración CEL",
        "Duración LDI",
        "Duración total",
        "Tarifa SLM",
        "Tarifa CEL",
        "Tarifa LDI",
        "Tarifa General",
    ])

    for d in datos:
        ws.append([
            d.get("nombre_calculo", ""),
            d.get("fecha", ""),
            d.get("facultad", ""),
            d.get("departamento", ""),
            d.get("duracion_slm", ""),
            d.get("duracion_cel", ""),
            d.get("duracion_ldi", ""),
            d.get("duracion_total", ""),
            d.get("tarif_slm", ""),
            d.get("tarif_cel", ""),
            d.get("tarif_ldi", ""),
            d.get("tarif_general", ""),
        ])

    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return ContentFile(output.read(), name=nombre_archivo)


def crear_excel_reporte_general(datos, nombre_archivo):
    wb = Workbook()
    ws = wb.active
    ws.title = "Reporte General"

    ws.append([
        "Nombre cálculo",
        "Fecha",
        "Facultad",
        "Duración SLM",
        "Duración CEL",
        "Duración LDI",
        "Duración total",
        "Tarifa SLM",
        "Tarifa CEL",
        "Tarifa LDI",
        "Tarifa General",
    ])

    for d in datos:
        ws.append([
            d.get("nombre_calculo", ""),
            d.get("fecha", ""),
            d.get("facultad", ""),
            d.get("duracion_slm", ""),
            d.get("duracion_cel", ""),
            d.get("duracion_ldi", ""),
            d.get("duracion_total", ""),
            d.get("tarif_slm", ""),
            d.get("tarif_cel", ""),
            d.get("tarif_ldi", ""),
            d.get("tarif_general", ""),
        ])

    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return ContentFile(output.read(), name=nombre_archivo)


def calculo_unidad(facultad_id, unidad_id, nombre_calculo):
    from datetime import datetime

    registros = RegistroLlamadas.objects.filter(
        id_facultad_id=facultad_id, id_unidad_id=unidad_id
    )
    if not registros.exists():
        raise ValueError("No hay registro para esta unidad")

    n_facultad = Facultad.objects.get(pk=facultad_id)
    n_proveedor = n_facultad.id_proveedor
    n_unidad = Departamento.objects.get(pk=unidad_id)

    duracion_cel = (
        registros.filter(tipo_llamada_sigla="CEL").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_slm = (
        registros.filter(tipo_llamada_sigla="SLM").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_ldi = (
        registros.filter(tipo_llamada_sigla="LDI").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_total = duracion_cel + duracion_slm + duracion_ldi

    tarif_cel = duracion_cel * float(n_proveedor.costo_seg_cel)
    tarif_slm = duracion_slm * float(n_proveedor.costo_seg_slm)
    tarif_ldi = duracion_ldi * float(n_proveedor.costo_seg_ldi)
    tarif_general = tarif_cel + tarif_slm + tarif_ldi

    calculo = CalculoMensualDepto.objects.create(
        id_facultad=n_facultad,
        id_unidad=n_unidad,
        nombre_calculo=nombre_calculo,
        duracion_total=duracion_total,
        duracion_cel=duracion_cel,
        duracion_slm=duracion_slm,
        duracion_ldi=duracion_ldi,
        tarif_cel=tarif_cel,
        tarif_slm=tarif_slm,
        tarif_ldi=tarif_ldi,
        tarif_general=tarif_general,
    )

    datos = [{
        "nombre_calculo": calculo.nombre_calculo,
        "fecha": calculo.fecha.strftime("%Y-%m-%d %H:%M:%S"),
        "facultad": calculo.id_facultad.nombre_facultad,
        "departamento": calculo.id_unidad.nombre_depto,
        "duracion_slm": calculo.duracion_slm,
        "duracion_cel": calculo.duracion_cel,
        "duracion_ldi": calculo.duracion_ldi,
        "duracion_total": calculo.duracion_total,
        "tarif_slm": calculo.tarif_slm,
        "tarif_cel": calculo.tarif_cel,
        "tarif_ldi": calculo.tarif_ldi,
        "tarif_general": calculo.tarif_general,
    }]
    # Generar nombre de archivo con timestamp
    nombre_archivo = (
        f"reporte_unidad_{unidad_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    )
    excel_file = crear_excel_reporte(datos, nombre_archivo)

    ReporteGenerado.objects.create(
        nombre=nombre_calculo,
        id_facultad=n_facultad,
        id_unidad=n_unidad,
        archivo=excel_file,
        fecha_creacion=datetime.now(),
    )

    return calculo



def calculo_general(facultad_id, nombre_calculo):
    from datetime import datetime

    registros = RegistroLlamadas.objects.filter(id_facultad_id=facultad_id)
    if not registros.exists():
        raise ValueError("No hay registros para esta facultad")

    n_facultad = Facultad.objects.get(pk=facultad_id)
    proveedor = n_facultad.id_proveedor

    duracion_cel = (
        registros.filter(tipo_llamada_sigla="CEL").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_slm = (
        registros.filter(tipo_llamada_sigla="SLM").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_ldi = (
        registros.filter(tipo_llamada_sigla="LDI").aggregate(
            total=Sum("duracion_llamada")
        )["total"]
        or 0
    )
    duracion_total = duracion_cel + duracion_slm + duracion_ldi

    tarif_cel = duracion_cel * float(proveedor.costo_seg_cel)
    tarif_slm = duracion_slm * float(proveedor.costo_seg_slm)
    tarif_ldi = duracion_ldi * float(proveedor.costo_seg_ldi)
    tarif_general = tarif_cel + tarif_slm + tarif_ldi

    calculo = CalculoMensualGeneral.objects.create(
        id_facultad=n_facultad,
        nombre_calculo=nombre_calculo,
        duracion_total=duracion_total,
        duracion_cel=duracion_cel,
        duracion_slm=duracion_slm,
        duracion_ldi=duracion_ldi,
        tarif_cel=tarif_cel,
        tarif_slm=tarif_slm,
        tarif_ldi=tarif_ldi,
        tarif_general=tarif_general,
    )

    datos = [{
        "nombre_calculo": calculo.nombre_calculo,
        "fecha": calculo.fecha.strftime("%Y-%m-%d %H:%M:%S"),
        "facultad": calculo.id_facultad.nombre_facultad,
        "duracion_slm": calculo.duracion_slm,
        "duracion_cel": calculo.duracion_cel,
        "duracion_ldi": calculo.duracion_ldi,
        "duracion_total": calculo.duracion_total,
        "tarif_slm": calculo.tarif_slm,
        "tarif_cel": calculo.tarif_cel,
        "tarif_ldi": calculo.tarif_ldi,
        "tarif_general": calculo.tarif_general,
    }]
    nombre_archivo = (
        f"reporte_facultad_{facultad_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    )
    excel_file = crear_excel_reporte_general(datos, nombre_archivo)

    ReporteGenerado.objects.create(
        nombre=nombre_calculo,
        id_facultad=n_facultad,
        id_unidad=None,
        archivo=excel_file,
        fecha_creacion=datetime.now(),
    )

    return calculo