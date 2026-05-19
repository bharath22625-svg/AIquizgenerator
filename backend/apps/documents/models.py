from django.db import models
from django.contrib.auth.models import User


class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents', null=True)

    FILE_TYPES = [
        ("pdf", "PDF"),
        ("docx", "DOCX"),
        ("txt", "TXT"),
    ]

    title = models.CharField(max_length=255)

    uploaded_file = models.FileField(
        upload_to="documents/"
    )

    file_type = models.CharField(
        max_length=10,
        choices=FILE_TYPES
    )

    extracted_text = models.TextField(
        blank=True,
        null=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title