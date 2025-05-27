from rest_framework import serializers
from .models import Profile, Anexo
from .models import Departamento, Facultad, ProveedorTelefono

class ProveedorTelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorTelefono
        fields = '__all__'

class FacultadSerializer(serializers.ModelSerializer):
    id_proveedor= serializers.PrimaryKeyRelatedField(queryset=ProveedorTelefono.objects.all())
    proveedor_detalle = ProveedorTelefonoSerializer(source='id_proveedor', read_only=True)
    class Meta:
        model = Facultad
        fields = '__all__'

class DepartamentoSerializer(serializers.ModelSerializer):
    id_facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    facultad_detalle = FacultadSerializer(source='id_facultad', read_only=True)
    class Meta:
        model = Departamento
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        correo = data.get('correo')
        password = data.get('password')

        try:
            profile = Profile.objects.get(correo=correo, password=password)
        except Profile.DoesNotExist:
            raise serializers.ValidationError("Correo o contraseña incorrectos")

        # Retorna los datos útiles
        return {
            'id': profile.id,
            'nombre': profile.nombre,
            'rol': profile.rol,
            'correo': profile.correo,
        }        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class AnexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anexo
        fields = '__all__'

class CalculoReporteSerializer(serializers.Serializer):
    facultadId = serializers.IntegerField(required=False)
    unidadId = serializers.IntegerField(required=False)
    proveedorId = serializers.IntegerField(required=True)

    def validate(self, data):
        facultad_id = data.get ('facultadId')
        unidad_id = data.get('unidadId')

        if not facultad_id and not unidad_id:
            raise serializers.ValidationError("Se debe proporcionar id_facultad o id_unidad.")
        return data