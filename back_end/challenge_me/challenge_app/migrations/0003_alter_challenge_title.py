# Generated by Django 4.0.5 on 2022-06-23 23:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('challenge_app', '0002_challengetype_challengeschedule_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='challenge',
            name='title',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
