import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/useQuizStore";
import api from "../lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, BrainCircuit } from "lucide-react";

export default function Quiz() {
  const { quizData, resetStore } = useQuizStore();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If page refreshed or no quiz data, go back
  if (!quizData || !quizData.questions) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">No quiz data found.</h2>
        <Button onClick={() => navigate("/")}>Go back home</Button>
      </div>
    );
  }

  const questions = quizData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionValue) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionValue,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const attemptedCount = Object.keys(selectedAnswers).length;
    
    if (quizData.quiz_id) {
      try {
        await api.post(`/quizzes/${quizData.quiz_id}/score/`, { 
          score,
          attempted: attemptedCount 
        });
      } catch (err) {
        console.error("Failed to save score:", err);
      }
    }
  };

  const handleRestart = () => {
    resetStore();
    navigate("/");
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="max-w-3xl w-full mx-auto py-8">
      <div className="mb-8 flex items-center justify-between animate-in slide-in-from-top-4 fade-in">
        <button 
          className="flex items-center text-slate-500 hover:text-slate-900 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold transition-all" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Generator
        </button>
        <div className="text-sm font-bold text-rose-800 bg-rose-100 shadow-sm px-4 py-1.5 rounded-full border border-rose-200">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {isSubmitted && (
        <Card className="mb-8 border-green-200 bg-green-50 shadow-md animate-in zoom-in-95 fade-in">
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-extrabold text-green-900 mb-2">Quiz Completed!</h2>
            <p className="text-xl font-medium text-green-800">
              You scored <span className="font-extrabold text-green-600 bg-white px-3 py-1 rounded-md shadow-sm border border-green-100 ml-2">{calculateScore()}</span> out of {questions.length}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 animate-in slide-in-from-bottom-8 fade-in duration-500">
        <CardHeader className="pb-4 border-b border-slate-100 mb-4">
          <CardTitle className="text-xl md:text-2xl leading-relaxed text-slate-950 font-extrabold">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              const isCorrect = option === currentQuestion.correct_answer;
              
              let styleClass = "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-sm";
              
              if (isSelected && !isSubmitted) {
                styleClass = "border-rose-300 bg-rose-50 text-rose-900 shadow-md font-bold";
              } else if (isSubmitted) {
                if (isCorrect) {
                  styleClass = "border-green-400 bg-green-50 text-green-900 shadow-md font-bold";
                } else if (isSelected && !isCorrect) {
                  styleClass = "border-red-300 bg-red-50 text-red-900 shadow-md font-bold";
                } else {
                  styleClass = "border-slate-200 bg-slate-50 opacity-60 text-slate-500";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${styleClass}`}
                >
                  <span className="text-base">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0 ml-2 drop-shadow-sm" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="text-red-600 w-6 h-6 flex-shrink-0 ml-2 drop-shadow-sm" />}
                </button>
              );
            })}
          </div>
          
          {isSubmitted && currentQuestion.explanation && (
            <div className="mt-6 p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-inner animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2 mb-2">
                <BrainCircuit className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-rose-950 uppercase tracking-wider text-xs">Explanation</span>
              </div>
              <p className="text-sm leading-relaxed font-medium">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-slate-200 pt-6 mt-2 bg-slate-50/50 rounded-b-xl">
          <Button 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold px-6 shadow-sm disabled:opacity-50 disabled:hover:bg-white"
          >
            Previous
          </Button>
          
          {!isSubmitted ? (
            isLastQuestion ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 shadow-md">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-slate-900 hover:bg-black text-white font-bold px-8 shadow-md">
                Next Question
              </Button>
            )
          ) : (
            isLastQuestion ? (
              <Button onClick={handleRestart} className="bg-slate-900 hover:bg-black text-white font-bold px-6 shadow-md">
                <RotateCcw className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-slate-900 hover:bg-black text-white font-bold px-8 shadow-md">
                Next Question
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
