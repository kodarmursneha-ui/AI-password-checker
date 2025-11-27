export interface AnalysisResult {
  score: number;
  complexity: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  crackTime: string;
  entropyBits: number;
  feedback: string;
  suggestions: string[];
  patternsFound: string[];
}

export interface PasswordHistoryItem {
  timestamp: number;
  score: number;
  complexity: string;
}
