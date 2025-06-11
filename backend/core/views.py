from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum
from .models import *
from .serializers import *
from .utils import calculo_general, calculo_unidad, procesar_archivo_excel, crear_excel_reporte, crear_excel_reporte_general
from django.utils import timezone
from django.http import FileResponse, Http404


class ProveedorTelefonoViewSet(viewsets.ModelViewSet):
    queryset = ProveedorTelefono.objects.all()
    serializer_class = ProveedorTelefonoSerializer


class FacultadViewSet(viewsets.ModelViewSet):
    queryset = Facultad.objects.all()
    serializer_class = FacultadSerializer


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.all().order_by("-fecha_creacion")
    serializer_class = AnexoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        print(" DEBUG: request.data =", request.data)
        print(" DEBUG: request.FILES =", request.FILES)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            anexo = serializer.instance

            try:
                procesar_archivo_excel(anexo.id_anexo)
            except Exception as e:
                print(f"Error procesando Excel: {e}")
                return Response(
                    {
                        "error": f"Archivo guardado pero error al procesar Excel: {str(e)}"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(" Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        anexo = self.get_object()
        archivo_path = anexo.archivo.path
        
        response = super().destroy(request, *args, **kwargs)
        
        if os.path.exists(archivo_path):
            os.remove(archivo_path)
        return response


@api_view(["POST"])
def generar_calculo_unidad(request):
    try:
        print("DATA RECIBIDA:", request.data)
        facultad_id = request.data["id_facultad"]
        unidad_id = request.data["id_unidad"]
        nombre_calculo = request.data.get("nombre_calculo", "Cálculo automático")

        calculo = calculo_unidad(facultad_id, unidad_id, nombre_calculo)
        return Response(
            {"mensaje": "Cálculo generado", "id_calculo": calculo.id_calculo}
        )
    except KeyError as e:
        return Response({"error": f"Falta el campo: {str(e)}"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def generar_calculo_general(request):
    try:
        facultad_id = request.data["id_facultad"]
        nombre_calculo = request.data.get("nombre_calculo", "Cálculo general")

        calculo = calculo_general(facultad_id, nombre_calculo)
        return Response(
            {"mensaje": "Cálculo general generado", "id_calculo": calculo.id_calculo}
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)



@api_view(["GET"])
def listar_reportes(request):
    facultad = request.GET.get("facultad")
    unidad = request.GET.get("unidad")
    print("Facultad:", facultad, "Unidad:", unidad)

    queryset = ReporteGenerado.objects.all()
    if facultad:
        queryset = queryset.filter(id_facultad=facultad)
    if unidad:
        queryset = queryset.filter(id_unidad=unidad)

    serializer = ReporteGeneradoSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def descargar_reporte(request, pk):
    try:
        reporte = ReporteGenerado.objects.get(pk=pk)
        return FileResponse(
            reporte.archivo.open("rb"), as_attachment=True, filename=reporte.nombre
        )
    except ReporteGenerado.DoesNotExist:
        raise Http404

@api_view(["DELETE"])
def eliminar_reporte(request, pk):
    try:
        reporte = ReporteGenerado.objects.get(pk=pk)
        if reporte.archivo:
            if os.path.exists(reporte.archivo.path):
                os.remove(reporte.archivo.path)
                reporte.delete()
                return Response(status=204)
    except ReporteGenerado.DoesNotExist:
        return Response({"error": "Reporte no encontrado"}, status=404)



@api_view(['GET'])
def trafico_por_proveedor_mes(request):
    proveedor_nombre = request.GET.get('proveedor')
    mes = request.GET.get('mes')

    if not proveedor_nombre or not mes:
        return Response([], status=400)

    try:
        proveedor = ProveedorTelefono.objects.get(nombre_proveedor__iexact=proveedor_nombre)
    except ProveedorTelefono.DoesNotExist:
        return Response([], status=404)

    llamadas = RegistroLlamadas.objects.filter(
        id_proveedor=proveedor,
        fecha_llamada__month=mes
    )

    resultados = []
    suma_segundos = 0
    suma_total = 0

    for tipo, nombre_tipo, costo_attr in [
        ('SLM', 'Local', 'costo_seg_slm'),
        ('CEL', 'Celular', 'costo_seg_cel'),
        ('LDI', 'Larga distancia', 'costo_seg_ldi')
    ]:
        total_segundos = llamadas.filter(tipo_llamada_sigla=tipo).aggregate(
            total=Sum('duracion_llamada')
        )['total'] or 0
        costo_segundo = float(getattr(proveedor, costo_attr))
        total = total_segundos * costo_segundo
        resultados.append({
            'tipo_llamada': nombre_tipo,
            'tiempo_segundos': total_segundos,
            'costo_segundo': costo_segundo,
            'total': total
        })
        suma_segundos += total_segundos
        suma_total += total

    # Agrega el resumen total al final
    resultados.append({
        'tipo_llamada': 'TOTAL',
        'tiempo_segundos': suma_segundos,
        'costo_segundo': None,
        'total': suma_total
    })

    return Response(resultados)