from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.documents.models import Document
from .models import Quiz
from .serializers import QuizSerializer

from apps.ai_engine.services import generate_mcqs


class QuizListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quizzes = Quiz.objects.filter(user=request.user).order_by('-created_at')
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)


class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        document_id = request.data.get("document_id")
        difficulty = request.data.get("difficulty")
        number_of_questions = request.data.get("number_of_questions")

        try:
            document = Document.objects.get(id=document_id, user=request.user)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found or access denied"},
                status=status.HTTP_404_NOT_FOUND
            )

        generated_questions = generate_mcqs(
            text=document.extracted_text,
            difficulty=difficulty,
            num_questions=number_of_questions
        )

        if "error" in generated_questions and isinstance(generated_questions, dict):
            return Response(
                {"error": generated_questions["error"]},
                status=status.HTTP_400_BAD_REQUEST
            )

        quiz = Quiz.objects.create(
            user=request.user,
            document=document,
            difficulty=difficulty,
            number_of_questions=len(generated_questions),
            generated_questions=generated_questions
        )

        return Response(
            {
                "success": True,
                "quiz_id": quiz.id,
                "total_questions": len(generated_questions),
                "questions": generated_questions
            },
            status=status.HTTP_201_CREATED
        )


class SubmitScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(id=pk, user=request.user)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        score = request.data.get("score")
        attempted = request.data.get("attempted")
        
        if score is not None:
            quiz.score = score
            if attempted is not None:
                quiz.attempted = attempted
            quiz.save()
            return Response({"success": True, "score": score, "attempted": attempted})
        return Response({"error": "Score is required"}, status=status.HTTP_400_BAD_REQUEST)