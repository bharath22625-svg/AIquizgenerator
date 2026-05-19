from django.db import models
from django.contrib.auth.models import User
from apps.documents.models import Document


class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes', null=True)
    score = models.IntegerField(null=True, blank=True)
    attempted = models.IntegerField(null=True, blank=True)

    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES
    )

    number_of_questions = models.IntegerField()

    generated_questions = models.JSONField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.document.title} - {self.difficulty}"