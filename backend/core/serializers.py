from rest_framework import serializers
from .models import Profile, Anexo
from .models import Departamento, Facultad, ProveedorTelefono
from .models import ReporteGenerado
import os
from .models import validar_excel


class ProveedorTelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorTelefono
        fields = "__all__"


class FacultadSerializer(serializers.ModelSerializer):
    id_proveedor = serializers.PrimaryKeyRelatedField(
        queryset=ProveedorTelefono.objects.all()
    )
    proveedor_detalle = ProveedorTelefonoSerializer(
        source="id_proveedor", read_only=True
    )

    class Meta:
        model = Facultad
        fields = "__all__"


class DepartamentoSerializer(serializers.ModelSerializer):
    id_facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    facultad_detalle = FacultadSerializer(source="id_facultad", read_only=True)

    class Meta:
        model = Departamento
        fields = "__all__"


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        correo = data.get("correo")
        password = data.get("password")

        try:
            profile = Profile.objects.get(correo=correo, password=password)
        except Profile.DoesNotExist:
            raise serializers.ValidationError("Correo o contraseña incorrectos")

        # Retorna los datos útiles
        return {
            "id": profile.id,
            "nombre": profile.nombre,
            "rol": profile.rol,
            "correo": profile.correo,
        }


class ProfileSerializer(serializers.ModelSerializer):
    id_facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    facultad_detalle = FacultadSerializer(source="id_facultad", read_only=True)
    id_unidad = serializers.PrimaryKeyRelatedField(queryset=Departamento.objects.all())
    unidad_detalle = DepartamentoSerializer(source="id_unidad", read_only=True)
    class Meta:
        model = Profile
        fields = "__all__"


class AnexoSerializer(serializers.ModelSerializer):
    archivo = serializers.FileField(required=False, validators=[validar_excel])

    id_facultad = serializers.PrimaryKeyRelatedField(
        queryset=Facultad.objects.all()
    )
    id_unidad = serializers.PrimaryKeyRelatedField(
        queryset=Departamento.objects.all()
    )

    facultad_detalle = FacultadSerializer(source="id_facultad", read_only=True)
    unidad_detalle = DepartamentoSerializer(source="id_unidad", read_only=True)

    class Meta:
        model = Anexo
        fields = "__all__"

    def validate_archivo(self, archivo):
        if archivo:
            ext = os.path.splitext(archivo.name)[1].lower()
            if ext not in [".xls", ".xlsx"]:
                raise serializers.ValidationError("Solo se permiten archivos Excel (.xls, .xlsx)")
        return archivo

    def validate(self, data):
        # Si es creación (no hay instancia) y no se pasa archivo => error
        if not self.instance and 'archivo' not in data:
            raise serializers.ValidationError({"archivo": "Debe subir un archivo Excel."})
        return data


class CalculoReporteSerializer(serializers.Serializer):
    facultadId = serializers.IntegerField(required=False)
    unidadId = serializers.IntegerField(required=False)
    proveedorId = serializers.IntegerField(required=True)

    def validate(self, data):
        facultad_id = data.get("facultadId")
        unidad_id = data.get("unidadId")

        if not facultad_id and not unidad_id:
            raise serializers.ValidationError(
                "Se debe proporcionar id_facultad o id_unidad."
            )
        return data


class ReporteGeneradoSerializer(serializers.ModelSerializer):
    facultad_detalle = FacultadSerializer(source="id_facultad", read_only=True)
    unidad_detalle = DepartamentoSerializer(source="id_unidad", read_only=True)

    class Meta:
        model = ReporteGenerado
        fields = [
            'id',
            'nombre',
            'id_facultad',
            'id_unidad',
            'archivo',
            'fecha_creacion',
            'facultad_detalle',
            'unidad_detalle',
        ]
    def get_facultad_detalle(self, obj):
        if obj.id_facultad:
            return FacultadSerializer(obj.id_facultad).data
        return None

    def get_unidad_detalle(self, obj):
        if obj.id_unidad:
            return DepartamentoSerializer(obj.id_unidad).data
        return None