from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
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
