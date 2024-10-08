# Generated by Django 4.0.3 on 2024-09-14 13:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_user_is_private'),
    ]

    operations = [
        migrations.CreateModel(
            name='FriendshipRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('sent', 'Sent'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='sent', max_length=20)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_friendshiprequests', to=settings.AUTH_USER_MODEL)),
                ('created_for', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_friendshiprequests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
