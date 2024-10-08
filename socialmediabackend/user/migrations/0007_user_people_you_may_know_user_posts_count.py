# Generated by Django 4.0.3 on 2024-09-14 18:08

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_friendshiprequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='people_you_may_know',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='posts_count',
            field=models.IntegerField(default=0),
        ),
    ]
