# Generated by Django 5.1.4 on 2024-12-14 03:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="shp",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("description", models.CharField(blank=True, max_length=2000)),
                ("file", models.FileField(upload_to="%y%m/%d")),
                (
                    "upload_date",
                    models.DateField(blank=True, default=datetime.date.today),
                ),
            ],
        ),
    ]
