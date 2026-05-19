from rest_framework import serializers
from .models import Quiz

class QuizSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'document_title', 'difficulty', 'number_of_questions', 'score', 'attempted', 'created_at', 'generated_questions']