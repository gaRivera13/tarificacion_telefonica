from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from datetime import datetime
from .models import *
from .serializers import *
from .utils import procesar_archivo_excel



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
            anexo = serializer.instance

            try:
                procesar_archivo_excel(anexo.id_anexo)
            except Exception as e:
                print(f"Error procesando Excel: {e}")
                return Response(
                    {'error': f'Archivo guardado pero error al procesar Excel: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(" Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def subir_anexo(request):
#     serializer = AnexoSerializer(data=request.data)
#     if serializer.is_valid():
#         anexo = serializer.save()
#         print("DEBUG: Anexo guardado con ID:", anexo.id)
#         print("DEBUG: Ruta del archivo:", anexo.archivo.path)
#         try:
#             procesar_archivo_excel(anexo)
#         except Exception as e:
            
#             return Response({'error': 'Error procesando archivo Excel'}, status=500)
    
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

# def calcular_reporte_facultad(facultad_id, proveedor_id):
#      # Aquí puedes llamar a la función en utils.py para realizar los cálculos
#      # Ejemplo para calcular el reporte de la facultad
#     realizar_calculos(facultad_id=facultad_id, proveedor_id=proveedor_id, es_facultad=True)
    
# def calcular_reporte_unidad(unidad_id, proveedor_id):
#      # Aquí puedes hacer el cálculo para la unidad, similar a la facultad
#     realizar_calculos(unidad_id=unidad_id, proveedor_id=proveedor_id, es_facultad=False)