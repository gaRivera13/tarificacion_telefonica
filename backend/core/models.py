from django.db import models
from django.core.exceptions import ValidationError
import os

class Facultad(models.Model):
    id_facultad = models.AutoField(primary_key=True)
    nombre_facultad = models.CharField(max_length=100)
    siglas_facultad = models.CharField(max_length=10)


    def __str__(self):
        return str(self.nombre_facultad)


class Departamento(models.Model):
    id_unidad = models.AutoField(primary_key=True)
    nombre_depto = models.CharField(max_length=100)
    siglas_depto = models.CharField(max_length=10)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    
    class Meta:
        db_table = 'departamentos'

    def __str__(self):
        return str(self.nombre_depto)


class ProveedorTelefono(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    siglas_proveedor = models.CharField(max_length=10)
    nombre_proveedor = models.CharField(max_length=100)
    costo_seg_cel = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_sim = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_idi = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'proveedores'

    def __str__(self):
        return str(self.nombre_proveedor)


class CuentaPresupuestaria(models.Model):
    id_cuenta = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_proveedor = models.ForeignKey(ProveedorTelefono, on_delete=models.CASCADE, db_column='id_proveedor')

    def __str__(self):
        return str(f'Cuenta de {self.id_facultad.nombre_facultad if self.id_facultad else "N/A"} con {self.id_proveedor.nombre_proveedor if self.id_proveedor else "N/A"}')

def validar_excel(archivo):
    ext = os.path.splitext(archivo.name)[1].lower()
    if ext not in ['.xls', 'xlsx']:
        raise ValidationError('Solo se permiten archivos Excel (.xls, .xlsx)')

class Anexo(models.Model):
    id_anexo = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_unidad = models.ForeignKey(Departamento, on_delete=models.CASCADE, db_column='id_unidad')
    nombre_anexo = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    archivo = models.FileField(upload_to='anexos/', validators=[validar_excel])
    
    class Meta:
        db_table = 'anexos'

    def __str__(self):
        return str(self.nombre_anexo)


class RegistroLlamadas(models.Model):
    id_registro = models.AutoField(primary_key=True)
    id_anexo = models.ForeignKey(Anexo, on_delete=models.CASCADE, db_column='id_anexo')
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_proveedor = models.ForeignKey(ProveedorTelefono, on_delete=models.CASCADE, db_column='id_proveedor')
    tipo_llamada_sigla = models.CharField(max_length=10)
    numero_telefono = models.CharField(max_length=15)
    fecha_llamada = models.DateField()
    hora_llamada = models.TimeField()
    tipo_respuesta = models.CharField(max_length=50)
    nombre_destinatario = models.CharField(max_length=100)

    class Meta:
        db_table = 'registro_llamadas'

    def __str__(self):
        return str(f'Llamada {self.id_registro}')


class CalculaMensual(models.Model):
    id_calculo = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_unidad = models.ForeignKey(Departamento, on_delete=models.CASCADE, db_column='id_unidad')
    tarif_generales = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_sin = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_cel = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_idi = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()
    
    class Meta:
        db_table = 'calculo_mensual'

    def __str__(self):
        return str(f'CalculoMensual {self.id_calculo}')


class Profile(models.Model):
    ROLES = (
        ('admin', 'Administrador'),
        ('encargado', 'Encargado de Unidad'),
    )

    nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    apellido_p = models.CharField(max_length=50)
    apellido_m = models.CharField(max_length=50)
    correo = models.EmailField(unique=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_unidad = models.ForeignKey(Departamento, on_delete=models.CASCADE, db_column='id_unidad')
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    rol = models.CharField(max_length=20, choices=ROLES)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.nombre
