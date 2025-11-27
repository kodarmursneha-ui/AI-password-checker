import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, Clock, Brain, Search } from 'lucide-react';

interface AnalysisDetailsProps {
  result: AnalysisResult;
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full animate-fade-in">
      
      {/* Key Metrics */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
           <Brain className="w-5 h-5 text-purple-400" />
           Entropy & Difficulty
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Estimated Entropy</span>
            <span className="text-xl font-mono text-cyan-400">{result.entropyBits} bits</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Time to Crack</span>
            <span className="text-xl font-mono text-orange-400 text-right">{result.crackTime}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Complexity Tier</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              result.complexity === 'Very Strong' ? 'bg-green-500/20 text-green-400' :
              result.complexity === 'Strong' ? 'bg-blue-500/20 text-blue-400' :
              result.complexity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {result.complexity}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Feedback */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          AI Assessment
        </h3>
        <p className="text-slate-300 italic mb-4">"{result.feedback}"</p>
        
        {result.patternsFound.length > 0 && (
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-400 mb-2 uppercase tracking-wider">Risks Detected</h4>
                <div className="flex flex-wrap gap-2">
                    {result.patternsFound.map((pattern, idx) => (
                        <span key={idx} className="flex items-center gap-1 bg-red-900/30 border border-red-800/50 text-red-300 px-2 py-1 rounded text-xs">
                             <ShieldAlert className="w-3 h-3" /> {pattern}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {result.suggestions.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2 uppercase tracking-wider">Recommendations</h4>
                <ul className="space-y-2">
                    {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>

    </div>
  );
};

export default AnalysisDetails;