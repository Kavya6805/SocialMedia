# Generated by Django 4.0.3 on 2024-09-18 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_alter_comment_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='body',
        ),
        migrations.AddField(
            model_name='comment',
            name='text',
            field=models.TextField(blank=True),
        ),
    ]
