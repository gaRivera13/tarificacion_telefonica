from rest_framework import serializers
from .models import Profile
from .models import Departamento, Facultad
class FacultadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facultad
        fields = '__all__'

class DepartamentoSerializer(serializers.ModelSerializer):
    id_facultad = serializers.PrimaryKeyRelatedField(queryset=Facultad.objects.all())
    class Meta:
        model = Departamento
        fields = '__all__'
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

