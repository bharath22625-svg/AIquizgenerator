import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/useQuizStore";
import api from "../lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FileUp, Loader2, BrainCircuit, CheckCircle2 } from "lucide-react";

const loadingMessages = [
  "Uploading document...",
  "Reading context...",
  "Firing up the AI...",
  "Analyzing text...",
  "Generating questions...",
  "This is a local AI model, it might take a minute...",
  "Almost there...",
  "Structuring JSON..."
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [pastDocuments, setPastDocuments] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const { setDocumentId, setQuizData, isLoading, setIsLoading, setError, error } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents/");
        setPastDocuments(res.data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 4000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedDocId(""); // Clear selection if new file is chosen
    }
  };

  const handleGenerate = async () => {
    if (!file && !selectedDocId) {
      setError("Please upload a new document or select a previous one.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let docId = selectedDocId;

      if (file && !selectedDocId) {
        // 1. Upload Document
        const formData = new FormData();
        formData.append("uploaded_file", file);
        formData.append("title", file.name);
        const ext = file.name.split('.').pop().toLowerCase();
        formData.append("file_type", ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : 'txt');

        const uploadRes = await api.post("/documents/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        docId = uploadRes.data.document_id;
      }

      setDocumentId(docId);

      // 2. Generate Quiz
      const quizRes = await api.post("/quizzes/generate/", {
        document_id: docId,
        difficulty: difficulty,
        number_of_questions: parseInt(numQuestions),
      });

      if (quizRes.data.questions && quizRes.data.questions.error) {
        throw new Error(quizRes.data.questions.error);
      }

      setQuizData(quizRes.data);
      navigate("/quiz");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "An error occurred while generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 relative overflow-hidden bg-slate-50 text-slate-900">
      
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-[128px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100/50 rounded-full blur-[128px] -z-10 animate-pulse delay-700 pointer-events-none" />

      <div className="text-center mb-6 animate-in slide-in-from-bottom-8 duration-1000 fade-in">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-200 hover:scale-105 transition-transform duration-500">
            <BrainCircuit className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-black to-slate-900 bg-[length:200%_auto] animate-gradient">
            AI Quiz Generator
          </h1>
        </div>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed mb-0">
          Transform your study material into an intelligent, interactive quiz in seconds.
        </p>
      </div>

      {/* Realistic 3D Book Container */}
      <div className="w-full max-w-5xl relative z-10 animate-in zoom-in-95 duration-1000 fade-in delay-200 mt-4 mb-4 flex justify-center" style={{ perspective: '1800px' }}>
        
        {/* Book Reflection (Bottom) */}
        <div className="absolute -bottom-8 left-10 right-10 h-12 bg-black/5 blur-xl rounded-full"></div>

        {/* The Book Assembly */}
        <div 
          className="relative flex w-full max-w-4xl"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: 'rotateX(10deg)', // Flatter angle towards camera
            transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* Spine Binding Center Curve */}
          <div className="absolute left-1/2 top-0 bottom-0 w-12 -ml-6 bg-gradient-to-r from-[#b08d6a] via-[#8c6a46] to-[#b08d6a] rounded-full z-0" style={{ transform: 'translateZ(-15px)' }}></div>

          {/* 3D Curved Diary Ribbon (SVG) */}
          <div className="absolute left-1/2 top-0 bottom-0 z-30 pointer-events-none" style={{ transform: 'translateX(-50%) translateZ(6px)', height: '115%', top: '-2px' }}>
            <svg width="50" height="100%" viewBox="0 0 50 500" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="ribbonShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="25%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#991b1b" />
                  <stop offset="80%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#450a0a" />
                </linearGradient>
                <filter id="threadShadow" x="-50%" y="-10%" width="200%" height="120%">
                  <feDropShadow dx="3" dy="4" stdDeviation="2" floodOpacity="0.5" />
                </filter>
                <clipPath id="ribbonTip">
                  <polygon points="0 0, 50 0, 50 500, 25 492, 0 500" />
                </clipPath>
              </defs>
              
              {/* Flat Fabric Ribbon with 3D Lighting & Morph Animation */}
              <g clipPath="url(#ribbonTip)">
                <path 
                  fill="none" 
                  stroke="url(#ribbonShine)" 
                  strokeWidth="6" 
                  strokeLinecap="butt"
                  filter="url(#threadShadow)"
                >
                  <animate 
                    attributeName="d" 
                    dur="8s" 
                    repeatCount="indefinite"
                    values="
                      M 25 8 C 33 60, 37 100, 25 180 C 13 260, 10 320, 25 400 C 35 460, 30 490, 25 500;
                      M 25 8 C 28 60, 32 100, 18 180 C 5 260, 8 320, 32 400 C 40 460, 33 490, 25 500;
                      M 25 8 C 33 60, 37 100, 25 180 C 13 260, 10 320, 25 400 C 35 460, 30 490, 25 500
                    "
                  />
                </path>
              </g>
            </svg>
          </div>

          {/* LEFT PAGE */}
          <div 
            className="w-1/2 bg-white relative z-10"
            style={{ 
              transformOrigin: 'right center', 
              transform: 'rotateY(6deg)', // Much straighter
              background: 'linear-gradient(to left, #94a3b8 0%, #cbd5e1 3%, #ffffff 12%, #ffffff 92%, #f1f5f9 100%)',
              boxShadow: 'inset -15px 0 25px -15px rgba(0,0,0,0.2), -1px 1px 0 #f8fafc, -2px 2px 0 #cbd5e1, -3px 3px 0 #f8fafc, -4px 4px 0 #cbd5e1, -5px 5px 0 #f8fafc, -6px 6px 0 #cbd5e1, -7px 7px 0 #f8fafc, -8px 8px 0 #cbd5e1, -9px 9px 0 #f8fafc, -10px 10px 0 #cbd5e1, -11px 11px 0 #f8fafc, -12px 12px 0 #94a3b8, -13px 13px 0 4px #b08d6a, -14px 14px 0 4px #8c6a46, -15px 15px 0 4px #8c6a46, -25px 30px 40px rgba(0,0,0,0.2)',
              borderLeft: '1px solid #e2e8f0',
              borderTop: '1px solid #f8fafc',
              borderBottom: '1px solid #cbd5e1',
              borderRadius: '10px 15px 15px 10px / 10px 15px 15px 10px' // Softer dip
            }}
          >
            {/* Page curve highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent pointer-events-none rounded-[inherit]" style={{ left: '15%', right: '45%' }}></div>
            
            {/* Left Page Content */}
            <div className="p-8 md:p-10 h-full flex flex-col relative z-10 text-slate-900">
              <div className="space-y-1 pb-5 border-b border-slate-300 mb-5 text-center">
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Study Material</h2>
                <p className="text-xs text-rose-600 uppercase tracking-widest font-bold">Step 1: Upload or Select</p>
              </div>
              
              <div className="space-y-5 flex-1 px-2">
                {error && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                {pastDocuments.length > 0 && (
                  <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select previous material</label>
                    <div className="relative">
                      <select 
                        value={selectedDocId} 
                        onChange={(e) => {
                          setSelectedDocId(e.target.value);
                          if (e.target.value) setFile(null);
                        }}
                        disabled={isLoading}
                        className="flex h-12 w-full appearance-none rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 shadow-inner hover:bg-slate-100 transition-colors"
                      >
                        <option value="">-- Upload a new file instead --</option>
                        {pastDocuments.map(doc => (
                          <option key={doc.id} value={doc.id}>{doc.title}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedDocId && (
                  <div className="group relative pt-2">
                    <label 
                      htmlFor="file-upload" 
                      className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-500 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-5">
                        <div className="p-4 bg-white shadow-sm border border-slate-200 rounded-full mb-3 group-hover:scale-110 group-hover:border-slate-400 transition-all duration-300">
                          <FileUp className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <p className="mb-1 text-sm text-slate-600">
                          <span className="font-bold text-slate-950">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">PDF, DOCX, TXT (MAX. 10MB)</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" disabled={isLoading} />
                    </label>
                    {file && (
                      <div className="mt-4 px-4 py-3 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-800 font-bold flex items-center justify-center animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-slate-700" />
                        {file.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div 
            className="w-1/2 bg-white relative z-10"
            style={{ 
              transformOrigin: 'left center', 
              transform: 'rotateY(-6deg)', // Much straighter
              background: 'linear-gradient(to right, #94a3b8 0%, #cbd5e1 3%, #ffffff 12%, #ffffff 92%, #f1f5f9 100%)',
              boxShadow: 'inset 15px 0 25px -15px rgba(0,0,0,0.2), 1px 1px 0 #f8fafc, 2px 2px 0 #cbd5e1, 3px 3px 0 #f8fafc, 4px 4px 0 #cbd5e1, 5px 5px 0 #f8fafc, 6px 6px 0 #cbd5e1, 7px 7px 0 #f8fafc, 8px 8px 0 #cbd5e1, 9px 9px 0 #f8fafc, 10px 10px 0 #cbd5e1, 11px 11px 0 #f8fafc, 12px 12px 0 #94a3b8, 13px 13px 0 4px #b08d6a, 14px 14px 0 4px #8c6a46, 15px 15px 0 4px #8c6a46, 25px 30px 40px rgba(0,0,0,0.2)',
              borderRight: '1px solid #e2e8f0',
              borderTop: '1px solid #f8fafc',
              borderBottom: '1px solid #cbd5e1',
              borderRadius: '15px 10px 10px 15px / 15px 10px 10px 15px' // Softer dip
            }}
          >
            {/* Page curve highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-[inherit]" style={{ right: '15%', left: '45%' }}></div>

            {/* Right Page Content */}
            <div className="p-8 md:p-10 h-full flex flex-col justify-between relative z-10 text-slate-900">
              
              <div className="space-y-5">
                <div className="space-y-1 pb-5 border-b border-slate-300 mb-5 text-center">
                  <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Configuration</h2>
                  <p className="text-xs text-rose-600 uppercase tracking-widest font-bold">Step 2: Customize Quiz</p>
                </div>

                <div className="space-y-6 pt-0 px-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-[10px] shadow-sm">1</span>
                      Difficulty Level
                    </label>
                    <div className="relative group">
                      <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value)}
                        disabled={isLoading}
                        className="flex h-12 w-full appearance-none rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 shadow-inner hover:bg-slate-100 transition-colors"
                      >
                        <option value="easy">Easy (Fundamentals)</option>
                        <option value="medium">Medium (Application)</option>
                        <option value="hard">Hard (Critical Thinking)</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-[10px] shadow-sm">2</span>
                      Question Count
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50" 
                      value={numQuestions} 
                      onChange={(e) => setNumQuestions(e.target.value)}
                      disabled={isLoading}
                      className="flex h-12 w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 shadow-inner hover:bg-slate-100 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-8 px-2">
                <Button 
                  className="w-full text-lg h-14 rounded-lg transition-all duration-300 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group border-0 hover:-translate-y-1" 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center w-full">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center">
                          <Loader2 className="mr-3 h-6 w-6 animate-spin text-white" />
                          <span className="font-semibold text-white tracking-wide">Generating Magic...</span>
                        </div>
                        <span className="text-xs font-medium text-slate-300 mt-1.5 animate-pulse tracking-wider">{loadingMessages[loadingMsgIndex]}</span>
                      </div>
                    ) : (
                      <span className="font-bold tracking-widest uppercase text-white">Create Quiz</span>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
