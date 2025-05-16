from rest_framework import serializers
from .models import Profile, Anexo
from .models import Departamento, Facultad, ProveedorTelefono


class FacultadSerializer(serializers.ModelSerializer):
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

class ProveedorTelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorTelefono
        fields = '__all__'

class AnexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anexo
        fields = '__all__'
        read_only_fields = ['fecha_creacion']