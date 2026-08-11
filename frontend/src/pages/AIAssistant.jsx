import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldAlert, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am CloudGuard AI, your SecOps Assistant. How can I assist with security explanations, threat remediations, or alert summaries today?`
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (userText) => {
    const textToSend = userText || prompt;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setPrompt('');
    setLoading(true);

    try {
      let aiResponseText = '';

      if (textToSend.toLowerCase().includes('summary') || textToSend.toLowerCase().includes('alert')) {
        const res = await api.post('/ai/summarize-alerts');
        aiResponseText = res.data.summary;
      } else if (textToSend.toLowerCase().includes('fix') || textToSend.toLowerCase().includes('remediat')) {
        const res = await api.post('/ai/remediation', { issue_description: textToSend });
        aiResponseText = res.data.remediation_plan;
      } else {
        const res = await api.post('/ai/explain-finding', { finding_title: textToSend });
        aiResponseText = res.data.explanation;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Apologies, I encountered an issue connecting to the threat intelligence service." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: "Give Security Posture Summary", action: "Summarize today's alerts and organizational posture" },
    { label: "Explain Public Database Finding", action: "Why is Public Database Access critical?" },
    { label: "Remediation for Unencrypted Storage", action: "How do I fix unencrypted customer-db storage?" },
    { label: "Explain Impossible Travel Risk", action: "Explain why Impossible Travel alert was generated" }
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            <span>AI Security Assistant Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Rule-backed AI threat analysis, vulnerability explanations, and automated remediation playbooks.</p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-purple-400" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-wrap font-sans'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-400">YOU</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-purple-400 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 italic">
                CloudGuard AI is analyzing threat rules and generating response...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-semibold uppercase text-slate-500 shrink-0">Quick Prompts:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp.action)}
              className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 whitespace-nowrap transition-colors shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask CloudGuard AI to explain a vulnerability, summarize alerts, or generate remediation steps..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <span>Ask AI</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
