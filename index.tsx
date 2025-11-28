import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Bot, AlertTriangle } from "lucide-react";

// Initialize AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check if API Key is available
    if (!process.env.API_KEY) {
      setError("HATA: API Key bulunamadı. Lütfen Vercel Environment Variables kısmına API_KEY ekleyin.");
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Call Gemini API
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setResponse(result.text || "Cevap metni boş döndü.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">Gemini API Tester</h1>
                <p className="text-blue-100 text-xs">Vercel Deployment Check</p>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Input Area */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">İsteminiz (Prompt)</label>
                <textarea
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32 text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Örnek: Bana kısa bir şiir yaz..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            {/* Action Button */}
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Üretiliyor...' : 'Gönder'}
            </button>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Output Area */}
            {response && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Cevabı</h3>
                    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {response}
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {/* Footer Info */}
      <p className="mt-6 text-xs text-gray-400 text-center">
        Powered by Google GenAI SDK & Vercel
      </p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);