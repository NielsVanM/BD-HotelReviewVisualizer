from django.db import models

# Tracks uploaded documents
class Upload(models.Model):
    filename = models.TextField()
    upload_date = models.DateTimeField(auto_now=True)
    source_ip = models.GenericIPAddressField()