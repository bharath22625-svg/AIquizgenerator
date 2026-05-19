import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Upload, Target, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Guide() {
  const navigate = useNavigate();

  const triggerZeroGravity = () => {
    // If we already injected the style, don't do it again
    if (document.getElementById('zero-gravity-style')) return;
    
    // Inject space physics CSS
    const style = document.createElement('style');
    style.id = 'zero-gravity-style';
    style.innerHTML = `
      @keyframes spaceFloat {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale)); opacity: var(--op); }
      }
      .floating-letter {
        display: inline-block;
        animation: spaceFloat var(--dur) ease-in-out infinite alternate;
        pointer-events: none;
      }
      body {
        overflow: hidden !important;
        height: 100vh !important;
      }
    `;
    document.head.appendChild(style);

    // Grab all text containing elements
    const elements = document.querySelectorAll('h1, h3, p, button:not(.easter-egg)');
    elements.forEach(el => {
      // Only process elements that directly contain text (no complex children)
      if (el.children.length === 0 || el.tagName === 'P') {
        const text = el.textContent;
        // Skip empty or very large elements to save performance
        if (text.trim().length === 0 || text.length > 500) return;
        
        el.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            el.appendChild(document.createTextNode(' '));
            continue;
          }
          const span = document.createElement('span');
          span.textContent = text[i];
          span.className = 'floating-letter';
          
          // Constrained trajectories so letters don't completely leave the screen
          const tx = (Math.random() * 300 - 150) + 'px';
          const ty = (Math.random() * 300 - 150) + 'px';
          const rot = (Math.random() * 720 - 360) + 'deg'; 
          // Slow duration: 15s to 45s
          const dur = (15 + Math.random() * 30) + 's';
          const scale = (0.5 + Math.random() * 1.5);
          const op = (0.2 + Math.random() * 0.8);
          
          span.style.setProperty('--tx', tx);
          span.style.setProperty('--ty', ty);
          span.style.setProperty('--rot', rot);
          span.style.setProperty('--dur', dur);
          span.style.setProperty('--scale', scale);
          span.style.setProperty('--op', op);
          
          el.appendChild(span);
        }
      }
    });
  };

  return (
    <div className="max-w-4xl w-full mx-auto py-12">
      <div className="mb-8 flex items-center justify-between animate-in slide-in-from-top-4 fade-in">
        <button 
          className="flex items-center text-slate-500 hover:text-slate-900 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg font-bold transition-all" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>

      <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 mt-4">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-rose-100 mb-6">
            <BookOpen className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
            How to use AI Quiz Generator
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl">
            Transform your study materials into interactive, intelligent quizzes in just three simple steps.
          </p>
        </div>
        
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="bg-rose-50 p-4 rounded-2xl shadow-sm border border-rose-200 shrink-0">
              <Upload className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Upload your Material</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Start by providing the subject matter you want to study. You can upload a PDF, Word document, or simple text file directly from your computer. If you have used the tool before, you can quickly select a document you've previously uploaded from the dropdown menu.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="bg-rose-50 p-4 rounded-2xl shadow-sm border border-rose-200 shrink-0">
              <Target className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Configure the Quiz</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Tailor the assessment to your current skill level. Select the difficulty level (Easy for fundamentals, Medium for application, Hard for critical thinking) and specify exactly how many questions you want the AI to generate based on your document's content.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="bg-rose-50 p-4 rounded-2xl shadow-sm border border-rose-200 shrink-0">
              <CheckCircle2 className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Test your Knowledge</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Take the generated multiple-choice quiz! Focus on each question. Once submitted, the AI will evaluate your answers, score your test, and provide customized, actionable recommendations on what specific topics you should study next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The forbidden button */}
      <button 
        onClick={triggerZeroGravity}
        className="easter-egg fixed bottom-8 right-8 px-4 py-2 bg-rose-100 text-rose-600 border border-rose-200 rounded-full font-bold shadow-md hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-105 transition-all z-50 flex items-center shadow-rose-200/50"
      >
        <span className="mr-2">⚠️</span> DO NOT CLICK ME
      </button>
    </div>
  );
}
