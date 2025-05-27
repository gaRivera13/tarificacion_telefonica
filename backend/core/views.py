from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from .models import *
from .serializers import *
from .utils import *


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
    queryset=Profile.objects.all()
    serializer_class=ProfileSerializer

# class AnexoUploadView(APIView):
#     parser_classes =[MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         serializer = AnexoSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'mensaje': 'Archivo subido correctamente', 'anexo': serializer.data}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AnexoListView(ListAPIView):
#     queryset = Anexo.objects.all().order_by('-fecha_creacion')
#     serializer_class = AnexoSerializer

class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.all().order_by('-fecha_creacion')
    serializer_class = AnexoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        print(" DEBUG: request.data =", request.data)
        print(" DEBUG: request.FILES =", request.FILES)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(" Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def calcular_reporte(request):
#     serializer = CalculoReporteSerializer(data=request.data)
#     if serializer.is_valid():
#         facultad_id = serializer.validated_data.get('facultadId')
#         unidad_id = serializer.validated_data.get('unidadId')
#         proveedor_id = serializer.validated_data.get('proveedorId')

#         try:
#             if facultad_id:
#                 calcular_reporte_facultad(facultad_id, proveedor_id)
#             elif unidad_id:
#                 calcular_reporte_unidad(unidad_id, proveedor_id)

#             return Response ({"message": "Reporte generado correctamente."}, status=200)
#         except Exception as e:
#             return Response ({"error": str(e)}, status=500)
#     return Response(serializer.errors, status=400)

    
# def calcular_reporte_facultad(facultad_id, proveedor_id):
#     # Aquí puedes llamar a la función en utils.py para realizar los cálculos
#     # Ejemplo para calcular el reporte de la facultad
#     realizar_calculos(facultad_id=facultad_id, proveedor_id=proveedor_id, es_facultad=True)

# def calcular_reporte_unidad(unidad_id, proveedor_id):
#     # Aquí puedes hacer el cálculo para la unidad, similar a la facultad
#     realizar_calculos(unidad_id=unidad_id, proveedor_id=proveedor_id, es_facultad=False)