from django.urls import path
from .views import GenerateQuizView, QuizListView, SubmitScoreView

urlpatterns = [
    path('', QuizListView.as_view(), name='quiz-list'),
    path('generate/', GenerateQuizView.as_view(), name='generate-quiz'),
    path('<int:pk>/score/', SubmitScoreView.as_view(), name='submit-score'),
]