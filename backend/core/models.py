from django.db import models

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

    def __str__(self):
        return str(self.nombre_depto)


class ProveedorTelefono(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombre_proveedor = models.CharField(max_length=100)
    costo_seg_cel = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_sim = models.DecimalField(max_digits=10, decimal_places=2)
    costo_seg_idi = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str(self.nombre_proveedor)


class CuentaPresupuestaria(models.Model):
    id_cuenta = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_proveedor = models.ForeignKey(ProveedorTelefono, on_delete=models.CASCADE, db_column='id_proveedor')

    def __str__(self):
        return str(f'Cuenta de {self.id_facultad.nombre_facultad if self.id_facultad else "N/A"} con {self.id_proveedor.nombre_proveedor if self.id_proveedor else "N/A"}')


class Anexo(models.Model):
    id_anexo = models.AutoField(primary_key=True)
    id_facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, db_column='id_facultad')
    id_unidad = models.ForeignKey(Departamento, on_delete=models.CASCADE, db_column='id_unidad')
    nombre_anexo = models.CharField(max_length=100)
    fecha_creacion = models.DateField()

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
    rut = models.CharField(max_length=12, unique=True)
    correo = models.EmailField(unique=True)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    rol = models.CharField(max_length=20, choices=ROLES)

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.nombre
