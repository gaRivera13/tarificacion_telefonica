from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Profile, Departamento, Facultad, ProveedorTelefono, Anexo
from .serializers import LoginSerializer, ProveedorTelefonoSerializer, AnexoSerializer
from .serializers import ProfileSerializer, DepartamentoSerializer, FacultadSerializer
from .serializers import LoginSerializer

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

class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.all().order_by('-fecha_creacion')
    serializer_class = AnexoSerializer

class AnexoUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        serializer = AnexoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
