from django.db import models

class Stats(models.Model):
    total_users = models.IntegerField()
    employed_users = models.IntegerField()
    employment_rate = models.FloatField()
    specialties_breakdown = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stats Snapshot - {self.created_at.strftime('%Y-%m-%d %H:%M')}"