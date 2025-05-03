from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=200)

    class Meta:
        db_table='profiles'

    def __str__(self):
        return self.name