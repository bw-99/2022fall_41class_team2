# Generated by Django 4.1.2 on 2022-10-27 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignment', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='assignment',
            options={'ordering': ['lecture_id']},
        ),
        migrations.RenameField(
            model_name='assignment',
            old_name='lecture',
            new_name='lecture_id',
        ),
        migrations.AddField(
            model_name='assignment',
            name='constraints',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='assignment',
            name='deadline',
            field=models.DateField(blank=True, null=True, verbose_name='Date'),
        ),
        migrations.AddField(
            model_name='assignment',
            name='name',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='assignment',
            name='question',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='assignment',
            name='skeleton_code',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
