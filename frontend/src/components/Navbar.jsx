import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./ui/button";
import { BrainCircuit, LogOut, User, HelpCircle, X, BookOpen, Upload, Target, CheckCircle2 } from "lucide-react";

export default function Navbar() {
  const { token, user, logout } = useAuthStore();
  const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-slate-700" />
          <span className="font-bold text-lg tracking-tight text-slate-900">AI Quiz Generator</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/guide"
            className="flex items-center text-sm font-bold text-slate-600 hover:text-rose-600 transition-colors mr-2"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            How it Works
          </Link>
          
          {token ? (
            <>
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Generate Quiz
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-300">
                <span className="text-sm text-slate-600 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                                    { storedUser?.username || storedUser?.email || storedUser?.name || "User" }
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            location.pathname !== "/login" && location.pathname !== "/register" && (
              <Link to="/login">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-black font-bold border-0">Log in</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
