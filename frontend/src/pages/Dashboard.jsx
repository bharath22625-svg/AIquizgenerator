import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuizStore } from "../store/useQuizStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Calendar, FileText, Target, PlayCircle, X, BarChart3, BrainCircuit } from "lucide-react";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();
  const { setQuizData, resetStore } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quizzes/");
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [token, navigate]);

  const handleResumeQuiz = (quiz) => {
    resetStore();
    setQuizData({
      quiz_id: quiz.id,
      total_questions: quiz.number_of_questions,
      questions: quiz.generated_questions
    });
    navigate("/quiz");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between animate-in slide-in-from-left-4 fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Your Dashboard
          </h1>
          <p className="text-slate-600 font-medium mt-2">View your past quizzes and scores.</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors font-bold text-sm shadow-md hover:shadow-lg"
        >
          Generate New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-slate-50 rounded-full mb-4 border border-slate-100 shadow-sm">
              <FileText className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-900">No quizzes yet!</p>
            <p className="text-sm font-medium text-slate-500 mt-2">Go to the home page to generate your first quiz.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz, i) => (
            <Card 
              key={quiz.id} 
              onClick={() => {
                if (quiz.score !== null) setSelectedQuiz(quiz);
              }}
              className={`bg-white border-slate-200 shadow-md transition-all animate-in fade-in ${quiz.score !== null ? 'hover:border-slate-300 cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}`} 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-950 line-clamp-1" title={quiz.document_title}>
                  {quiz.document_title || "Document"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center"><Target className="w-4 h-4 mr-2 text-rose-600" /> Difficulty:</span>
                    <span className="capitalize font-bold text-slate-900">{quiz.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-rose-600" /> Questions:</span>
                    <span className="font-bold text-slate-900">{quiz.number_of_questions}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <span className="font-bold text-slate-800">Score:</span>
                    {quiz.score !== null ? (
                      <span className="font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-md">
                        {quiz.score} / {quiz.number_of_questions}
                        <BarChart3 className="w-4 h-4 ml-2 text-green-600" />
                      </span>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResumeQuiz(quiz);
                        }}
                        className="flex items-center text-rose-600 hover:text-rose-700 font-bold transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md"
                      >
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Take Quiz
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedQuiz(null)}>
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-slate-950 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-rose-600" />
                Quiz Analysis
              </h2>
              <button onClick={() => setSelectedQuiz(null)} className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-200 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-around">
                {/* Donut Chart */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="10" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - ((selectedQuiz.score / selectedQuiz.number_of_questions) * 100 * 251.2) / 100}
                      className="text-green-500 transition-all duration-1000 ease-out drop-shadow-md" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-950">{Math.round((selectedQuiz.score / selectedQuiz.number_of_questions) * 100)}%</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Accuracy</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[120px] shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Attempted</p>
                    <p className="text-xl font-extrabold text-blue-600">{selectedQuiz.attempted ?? selectedQuiz.number_of_questions}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[120px] shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Correct</p>
                    <p className="text-xl font-extrabold text-green-600">{selectedQuiz.score}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[120px] shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Incorrect</p>
                    <p className="text-xl font-extrabold text-red-600">{(selectedQuiz.attempted ?? selectedQuiz.number_of_questions) - selectedQuiz.score}</p>
                  </div>
                </div>
              </div>

  
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
