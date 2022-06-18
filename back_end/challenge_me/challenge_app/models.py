from django.db import models


class Challenge(models.Model):
    challenge_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

