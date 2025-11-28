import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { Send, Loader2, Bot, AlertTriangle, Key, ExternalLink, Settings } from "lucide-react";

// Initialize AI Client safely
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // -------------------------------------------------------------------------
  // 1. API KEY CHECK & SETUP GUIDE
  // If no API Key is detected, we show this guide instead of the main app.
  // -------------------------------------------------------------------------
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in duration-300">
           
           {/* Setup Header */}
           <div className="bg-amber-500 p-6 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-white">Kurulum Gerekli</h1>
           </div>
           
           <div className="p-8 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Uygulamanın çalışabilmesi için <strong>API_KEY</strong> environment variable'ının Vercel üzerinde tanımlanması gerekmektedir.
              </p>

              {/* Step-by-step Guide */}
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 space-y-4">
                <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                  <Settings className="w-4 h-4"/> Vercel Kurulum Adımları:
                </h3>
                <ol className="list-decimal list-inside text-sm text-amber-800 space-y-3 ml-1">
                  <li>Vercel Dashboard'una git.</li>
                  <li>Bu projeyi seç ve <strong>Settings</strong> sekmesine tıkla.</li>
                  <li>Soldaki menüden <strong>Environment Variables</strong>'ı seç.</li>
                  <li>
                    Yeni değişken ekle:
                    <ul className="list-disc list-inside ml-4 mt-1 text-amber-700/80 font-mono text-xs">
                        <li>Key: <span className="font-bold text-amber-900">API_KEY</span></li>
                        <li>Value: <span className="italic">Senin Google Gemini API Anahtarın</span></li>
                    </ul>
                  </li>
                  <li>Değişiklikleri kaydet ve projeyi <strong>Redeploy</strong> et.</li>
                </ol>
              </div>

              {/* Action Link */}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Key className="w-4 h-4"/>
                Google AI Studio'dan Key Al
                <ExternalLink className="w-4 h-4 opacity-70"/>
              </a>
              
              <p className="text-xs text-center text-gray-400">
                Ayarlamayı yaptıktan sonra sayfayı yenileyin.
              </p>
           </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. MAIN APPLICATION
  // -------------------------------------------------------------------------
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
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
      setError(err.message || "Bir hata oluştu. API Key'inizin geçerli olduğundan emin olun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* App Header */}
        <div className="bg-blue-600 p-6 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot className="text-white w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">Gemini API Tester</h1>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-400"></span>
                   System Online
                </p>
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
                    <div>
                        <p className="font-semibold text-sm">İşlem Başarısız</p>
                        <p className="text-xs mt-1 opacity-90">{error}</p>
                    </div>
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