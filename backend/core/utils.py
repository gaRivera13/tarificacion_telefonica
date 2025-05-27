import pandas as pd
from .models import *
from django.core.exceptions import ValidationError
from datetime import datetime
from django.db.models import Sum

def procesar_archivo_excel(anexo):
     archivo_path = anexo.archivo.path
     try:
           df = pd.read_excel(archivo_path)
     except Exception as e:
         raise ValidationError(f"Error al leer el archivo: {e}")
     
     for index, row in df.iterrows():
          try:
              #Validaciones previas para verificar si los datos son correctos
              facultad = Facultad.objects.get(siglas_facultad=row['siglas_facultad'])
              unidad = Departamento.objects.get(siglas_depto=row['siglas_depto'])
              proveedor = ProveedorTelefono.objects.get(nombre_proveedor=row['nombre_proveedor'])
              
               # Crear un nuevo registro en RegistroLlamadas
              RegistroLlamadas.objects.create(
                   id_anexo=anexo,
                   id_facultad=facultad,
                   id_unidad=unidad,
                   id_proveedor=proveedor,
                   tipo_llamada_sigla=row['tipo_llamada_sigla'],
                   numero_telefono=row['numero_telefono'],
                   fecha_llamada=row['fecha_llamada'],
                   hora_llamada=row['hora_llamada'],
                   duracion_llamada=row['duracion_llamada'],
                   tipo_respuesta=row['tipo_respuesta'],
                   nombre_destinatario=row['nombre_destinatario']
                   )
          except Facultad.DoesNotExist:
              print(f"Facultad no encontrada en la fila {index}: {row['siglas_facultad']}")
          except Departamento.DoesNotExist: 
              print(f"Departamento no encontrado en la fila {index}: {row['siglas_depto']}")
          except ProveedorTelefono.DoesNotExist:
              print(f"Proveedor no encontrado en la fila {index}: {row['nombre_proveedor']}")
          except Exception as e:
              print(f"Error al procesar la fila {index}: {e}")


def realizar_calculos(facultad_id=None, unidad_id=None, proveedor_id=None, es_facultad=True):
    # Cálculo como facultad
    if es_facultad:
        try:
            facultad = Facultad.objects.get(id=facultad_id)
            # Obtener todas las llamadas de esa facultad
            llamadas_facultad = RegistroLlamadas.objects.filter(id_facultad=facultad, id_proveedor__id=proveedor_id)
            # Calcular las duraciones totales por tipo de llamada
            duracion_total = llamadas_facultad.aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_slm = llamadas_facultad.filter(tipo_llamada_sigla='SLM').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_cel = llamadas_facultad.filter(tipo_llamada_sigla='CEL').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_ldi = llamadas_facultad.filter(tipo_llamada_sigla='LDI').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            
            # Buscar tarifas para la facultad
            tarif_facultad = CalculoMensualGeneral.objects.filter(id_facultad=facultad).last()
            if tarif_facultad:
                costo_general = duracion_total * tarif_facultad.tarif_general
                costo_slm = duracion_slm * tarif_facultad.tarif_slm
                costo_cel = duracion_cel * tarif_facultad.tarif_cel
                costo_ldi = duracion_ldi * tarif_facultad.tarif_ldi
                
                # Crear o actualizar el cálculo general de la facultad
                CalculoMensualGeneral.objects.create(
                    id_facultad=facultad,
                    nombre_calculo = f"Cálculo mensual {facultad.nombre_facultad} - {datetime.now().strftime('%B %Y')}",
                    duracion_total=duracion_total,
                    duracion_slm=duracion_slm,
                    duracion_cel=duracion_cel, 
                    duracion_ldi=duracion_ldi,
                    tarif_general=tarif_facultad.tarif_general,
                    tarif_slm=tarif_facultad.tarif_slm,
                    tarif_cel=tarif_facultad.tarif_cel,
                    tarif_ldi=tarif_facultad.tarif_ldi,
                    fecha=datetime.now() 
                    )
            else:
                print (f"No se encontraron tarifas para la facultad {facultad.nombre_facultad}")
        except Facultad.DoesNotExist:
            print (f"Facultad con ID {facultad_id} no encontrada.")
            return
    else:
        
        try:
            # Cálculos por unidad/departamento  
            depto = Departamento.objects.get(id=unidad_id)
            # Obtener todas las llamadas de ese departamento
            llamadas_depto = RegistroLlamadas.objects.filter(id_unidad=depto, id_proveedor__id=proveedor_id)
            
            # Calcular las duraciones totales por tipo de llamada
            duracion_total = llamadas_depto.aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_slm = llamadas_depto.filter(tipo_llamada_sigla='SLM').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_cel = llamadas_depto.filter(tipo_llamada_sigla='CEL').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            duracion_ldi = llamadas_depto.filter(tipo_llamada_sigla='LDI').aggregate(Sum('duracion_llamada'))['duracion_llamada__sum'] or 0
            
            # Buscar tarifas para el departamento
            tarif_depto = CalculoMensualDepto.objects.filter(id_unidad=depto).last()
            if tarif_depto: 
                # Calcular los costos
                costo_general = duracion_total * tarif_depto.tarif_general
                costo_slm = duracion_slm * tarif_depto.tarif_slm
                costo_cel = duracion_cel * tarif_depto.tarif_cel
                costo_ldi = duracion_ldi * tarif_depto.tarif_ldi
                
                # Crear o actualizar el cálculo mensual para el departamento
                CalculoMensualDepto.objects.create(
                    id_facultad=depto.id_facultad, # La facultad asociada al departamento
                    id_unidad=depto,
                    nombre_calculo=f"Cálculo mensual {depto.nombre_depto} - {datetime.now().strftime('%B %Y')}",
                    duracion_total=duracion_total,
                    duracion_slm=duracion_slm,
                    duracion_cel=duracion_cel, 
                    duracion_ldi=duracion_ldi,
                    tarif_general=tarif_depto.tarif_general,
                    tarif_slm=tarif_depto.tarif_slm,
                    tarif_cel=tarif_depto.tarif_cel,
                    tarif_ldi=tarif_depto.tarif_ldi,
                    fecha=datetime.now()
                    ) 
            else:
                print(f"No se encontraron tarifas para el departamento {depto.nombre_depto}")
        except Departamento.DoesNotExist:
            print (f"Departamento con ID {unidad_id} no encontrado.")
            return