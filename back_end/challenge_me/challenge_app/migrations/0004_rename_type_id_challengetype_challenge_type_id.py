# Generated by Django 4.0.5 on 2022-07-02 11:28

from django.db import migrations


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ('challenge_app', '0003_alter_challenge_title'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ChallengeType',
            old_name='type_id',
            new_name='challenge_type_id',
        ),
    ]
