# Generated by Django 4.1.2 on 2022-10-28 06:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0002_alter_assignment_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='assignment',
            options={'ordering': ['lecture']},
        ),
        migrations.RenameField(
            model_name='assignment',
            old_name='lecture_id',
            new_name='lecture',
        ),
    ]
