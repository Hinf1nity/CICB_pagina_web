from django.db import models

class Img(models.Model):
    ruta = models.CharField(max_length=500)

    def __str__(self):
        return self.ruta
