from django.db import models

class Facultad(models.Model):
    # Asumiendo que existe una tabla Facultad
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Departamento(models.Model):
    id_unidad = models.AutoField(primary_key=True)
    nombre_depto = models.CharField(max_length=100)
    siglas_depto = models.CharField(max_length=10)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_depto


class CalculaMensual(models.Model):
    id = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE)
    nombre_depto = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    tarif_generales = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_sin = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_cel = models.DecimalField(max_digits=10, decimal_places=2)
    tarif_idi = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()

    def __str__(self):
        return f'CalculoMensual {self.id}'


class ProveedorTelefono(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    costo_seg_cel = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_sim = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_idi = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre


class CuentaPresupuestaria(models.Model):
    id = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE)
    id_proveedor = models.ForeignKey(ProveedorTelefono, on_delete=models.CASCADE)
    nombre_facultad = models.CharField(max_length=100)
    siglas_facultad = models.CharField(max_length=10)

    def __str__(self):
        return self.nombre_facultad


class Anexo(models.Model):
    id_anexo = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE)
    id_unidad = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    nombre_anexo = models.CharField(max_length=100)
    fecha_creacion = models.DateField()

    def __str__(self):
        return self.nombre_anexo


class RegistroLlamadas(models.Model):
    id = models.AutoField(primary_key=True)
    id_anexo = models.ForeignKey(Anexo, on_delete=models.CASCADE)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE)
    nombre_proveedor = models.CharField(max_length=100)
    tipo_llamada_sigla = models.CharField(max_length=10)
    numero_telefono = models.CharField(max_length=15)
    fecha_llamada = models.DateField()
    hora_llamada = models.TimeField()
    tipo_respuesta = models.CharField(max_length=50)
    siglas_facultad = models.CharField(max_length=10)
    siglas_unidad = models.CharField(max_length=10)
    nombre_destinatario = models.CharField(max_length=100)

    def __str__(self):
        return f'Llamada {self.id}'

class Profile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=200)

    class Meta:
        db_table='profiles'

    def __str__(self):
        return self.name