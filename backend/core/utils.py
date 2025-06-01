import pandas as pd
from .models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.db.models import Sum, Q
from django.shortcuts import get_object_or_404

def procesar_archivo_excel(anexo_id):
    anexo = get_object_or_404 (Anexo, id_anexo=anexo_id)
    archivo_ruta = anexo.archivo.path

    df = pd.read_excel(archivo_ruta)


    for _, fila in df.iterrows():
        proveedor = get_object_or_404(ProveedorTelefono, nombre_proveedor=fila['nombre_proveedor'])
        facultad = get_object_or_404(Facultad, siglas_facultad=fila['siglas_facultad'])
        departamento = get_object_or_404(Departamento, siglas_depto=fila['siglas_depto'])

        # Crear un nuevo registro de llamada
        RegistroLlamadas.objects.create(
            id_anexo=anexo,
            id_facultad=facultad,
            id_unidad=departamento,
            id_proveedor=proveedor,
            tipo_llamada_sigla=fila['tipo_llamada_sigla'],
            numero_telefono=fila['numero_telefono'],
            fecha_llamada=fila['fecha_llamada'],
            hora_llamada=datetime.strptime(str(fila['hora_llamada']), '%H:%M:%S').time(),
            duracion_llamada=int(fila['duracion_llamada']),
            tipo_respuesta=fila['tipo_respuesta'],
            nombre_destinatario=fila['nombre_destinatario']
        )


def calculo_unidad (facultad_id, unidad_id, nombre_calculo):
    #Obtiene registro por la facultad y su depto
    registros = RegistroLlamadas.objects.filter(
        id_facultad_id = facultad_id,
        id_unidad_id = unidad_id
    )
    if not registros.exists():
        raise ValueError("No hay registro para esta unidad")
    
    n_facultad = Facultad.objects.get(pk=facultad_id)
    n_proveedor = n_facultad.id_proveedor

    #filtra
    duracion_cel = registros.filter(tipo_llamada_sigla='CEL').aggregate(total=Sum('duracion_llamada'))['total'] or 0
    duracion_slm = registros.filter(tipo_llamada_sigla='SLM').aggregate(total=Sum('duracion_llamada'))['total'] or 0
    duracion_ldi = registros.filter(tipo_llamada_sigla='LDI').aggregate(total=Sum('duracion_llamada'))['total'] or 0
    duracion_total = duracion_cel + duracion_slm + duracion_ldi

    #Calcula
    tarif_cel = duracion_cel * float(n_proveedor.costo_seg_cel)
    tarif_slm = duracion_slm * float(n_proveedor.costo_seg_slm)
    tarif_ldi = duracion_ldi * float(n_proveedor.costo_seg_ldi)
    tarif_general = tarif_cel + tarif_slm + tarif_ldi

    calculo = CalculoMensualDepto.objects.create(
        id_facultad=n_facultad,
        id_unidad=Departamento.objects.get(pk=unidad_id),
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
    return calculo

def calculo_general (facultad_id, nombre_calculo):
     registros = RegistroLlamadas.objects.filter(id_facultad_id=facultad_id)

     if not registros.exists():
         raise ValueError("No hay registros para esta facultad")
     
     id_facultad_id = Facultad.objects.get(pk=facultad_id)
     proveedor = id_facultad_id.id_proveedor
     
     duracion_cel = registros.filter(tipo_llamada_sigla='CEL').aggregate(total=Sum('duracion_llamada'))['total'] or 0
     duracion_slm = registros.filter(tipo_llamada_sigla='SLM').aggregate(total=Sum('duracion_llamada'))['total'] or 0
     duracion_ldi = registros.filter(tipo_llamada_sigla='LDI').aggregate(total=Sum('duracion_llamada'))['total'] or 0
     duracion_total = duracion_cel + duracion_slm + duracion_ldi

     tarif_cel = duracion_cel * float(proveedor.costo_seg_cel)
     tarif_slm = duracion_slm * float(proveedor.costo_seg_slm)
     tarif_ldi = duracion_ldi * float(proveedor.costo_seg_ldi)
     tarif_general = tarif_cel + tarif_slm + tarif_ldi
     
     calculo = CalculoMensualGeneral.objects.create(
        id_facultad=id_facultad_id,
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
     return calculo