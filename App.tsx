import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Wand2, Lock, AlertTriangle, RefreshCw } from 'lucide-react';
import { analyzePasswordStrength, generateStrongPassword } from './services/geminiService';
import StrengthGauge from './components/StrengthGauge';
import AnalysisDetails from './components/AnalysisDetails';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!password) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzePasswordStrength(password);
      setResult(data);
    } catch (e) {
      setError("Failed to analyze password. Please check your API key and internet connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const newPass = await generateStrongPassword();
      setPassword(newPass);
      // Automatically analyze generated password
      setIsAnalyzing(true);
      const data = await analyzePasswordStrength(newPass);
      setResult(data);
      setIsAnalyzing(false);
    } catch (e) {
      setError("Failed to generate password.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Debounced analysis for smoother typing experience? 
  // Given prompts usually have limits, manual trigger is safer for tokens, 
  // but let's stick to manual button for "Deep AI Analysis" to save quota 
  // and maybe just simple visual feedback later. For now, manual trigger is best.

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-8 font-sans">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sentinel AI</h1>
            <p className="text-slate-400 text-sm">Advanced Password Auditor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl space-y-8">
        
        {/* Input Section */}
        <section className="bg-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl shadow-black/20 border border-slate-700">
          <div className="flex flex-col gap-4">
            <label className="text-slate-300 font-medium ml-1">Test your password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              
              <input
                type={isVisible ? "text" : "password"}
                className="block w-full pl-12 pr-32 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                placeholder="Enter password to analyze..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title={isVisible ? "Hide password" : "Show password"}
                >
                  {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                   onClick={handleGenerate}
                   disabled={isGenerating}
                   className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                   title="Generate strong password"
                >
                   {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start mt-2">
                <p className="text-xs text-slate-500 max-w-md">
                   <AlertTriangle className="inline w-3 h-3 mr-1 mb-0.5 text-yellow-500" />
                   Security Notice: Passwords are processed by Google's Gemini AI. Do not enter real banking or sensitive passwords for this demo.
                </p>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !password}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-lg flex items-center gap-2
                        ${isAnalyzing || !password 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 active:scale-95'
                        }`}
                >
                    {isAnalyzing ? (
                        <>
                         <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                        </>
                    ) : (
                        'Analyze Strength'
                    )}
                </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {error && (
             <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
                 <AlertTriangle className="w-5 h-5 shrink-0" />
                 {error}
             </div>
        )}

        {result && (
          <section className="animate-fade-in-up">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Gauge Card */}
                 <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col items-center justify-center lg:col-span-1">
                     <h3 className="text-slate-400 font-semibold mb-4 uppercase tracking-wider text-sm">Overall Score</h3>
                     <StrengthGauge score={result.score} />
                     <p className={`mt-4 text-center font-medium ${
                         result.score > 70 ? 'text-green-400' : result.score > 40 ? 'text-yellow-400' : 'text-red-400'
                     }`}>
                         {result.score > 70 ? 'Excellent Protection' : result.score > 40 ? 'Moderate Protection' : 'Weak Protection'}
                     </p>
                 </div>

                 {/* Detailed Analysis */}
                 <div className="lg:col-span-2">
                     <AnalysisDetails result={result} />
                 </div>
             </div>
          </section>
        )}

        {/* Empty State / Placeholder */}
        {!result && !isAnalyzing && !error && (
            <div className="text-center py-20 opacity-50">
                <Shield className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl text-slate-500 font-medium">Ready to audit</h3>
                <p className="text-slate-600 mt-2">Enter a password above to begin the security assessment.</p>
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Sentinel AI. Powered by Google Gemini.</p>
      </footer>

      {/* Global CSS for simplistic animations */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;