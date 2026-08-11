import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  title?: string;
  badge?: string;
  codeBlock?: {
    header: string;
    code: string;
  };
  actions?: string[];
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Summarize the findings from the latest IAM vulnerability scan on the production AWS account.',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'I analyzed the scan scan results for account prod-main-492. The primary issue is an overly permissive policy attached to the DevOps-Deploy-Role. It currently allows iam:PassRole on all resources, which could lead to privilege escalation.',
      title: 'Scan Summary: IAM Vulnerability (High Risk)',
      badge: 'Critical',
      codeBlock: {
        header: 'Recommended Fix (Terraform)',
        code: `data "aws_iam_policy_document" "restrict_passrole" {
  statement {
    effect  = "Allow"
    actions = ["iam:PassRole"]
    
    # Restrict to specific ARNs required for deployment
    resources = [
      "arn:aws:iam::123456789012:role/SpecificServiceRole"
    ]
  }
}`,
      },
      actions: [
        'Apply Fix via Terraform',
        'Scan Related Assets',
        'Draft Security Report',
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputVal,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `Understood. I have initiated a background query and correlated the asset metrics. Your configurations are compliant with standard NIST control bounds. Let me know if you need to run another active simulation.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background h-screen flex antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex h-full overflow-hidden">
        
        {/* Column 1: Conversation History (Left Sidebar) */}
        <aside className="w-72 bg-surface-container flex flex-col border-r border-outline-variant flex-shrink-0 h-full">
          <div className="p-stack-md border-b border-outline-variant flex justify-between items-center h-16 shrink-0">
            <h2 className="font-headline-sm text-sm font-semibold text-on-surface">History</h2>
            <button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-neutral-800 transition-colors">
              <span className="material-symbols-outlined text-base">edit_square</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-stack-sm flex flex-col gap-stack-lg p-3 space-y-4">
            
            {/* Category 1 */}
            <div>
              <h3 className="font-label-mono text-xs uppercase text-outline-variant px-stack-sm mb-stack-sm text-[10px] tracking-wider mb-2">
                Recent Investigations
              </h3>
              <ul className="flex flex-col gap-1 space-y-1">
                <li>
                  <a className="block px-3 py-2 rounded bg-neutral-900 text-primary font-medium text-xs border border-outline-variant" href="#">
                    IAM Privilege Escalation
                  </a>
                </li>
                <li>
                  <a className="block px-3 py-2 rounded text-on-surface-variant hover:bg-neutral-900 hover:text-on-surface text-xs transition-colors" href="#">
                    Anomalous S3 Access
                  </a>
                </li>
              </ul>
            </div>

            {/* Category 2 */}
            <div>
              <h3 className="font-label-mono text-xs uppercase text-outline-variant px-stack-sm mb-stack-sm text-[10px] tracking-wider mb-2">
                Policy Drafting
              </h3>
              <ul className="flex flex-col gap-1 space-y-1">
                <li>
                  <a className="block px-3 py-2 rounded text-on-surface-variant hover:bg-neutral-900 hover:text-on-surface text-xs transition-colors" href="#">
                    Zero Trust Network Rules
                  </a>
                </li>
                <li>
                  <a className="block px-3 py-2 rounded text-on-surface-variant hover:bg-neutral-900 hover:text-on-surface text-xs transition-colors" href="#">
                    EKS Role Bindings
                  </a>
                </li>
              </ul>
            </div>

            {/* Category 3 */}
            <div>
              <h3 className="font-label-mono text-xs uppercase text-outline-variant px-stack-sm mb-stack-sm text-[10px] tracking-wider mb-2">
                Compliance Audit
              </h3>
              <ul className="flex flex-col gap-1 space-y-1">
                <li>
                  <a className="block px-3 py-2 rounded text-on-surface-variant hover:bg-neutral-900 hover:text-on-surface text-xs transition-colors" href="#">
                    SOC2 Readiness Check
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </aside>

        {/* Column 2: Chat Interface (Center) */}
        <section className="flex-1 flex flex-col bg-background relative h-full overflow-hidden">
          <div className="h-16 border-b border-outline-variant flex items-center px-margin-page bg-surface/80 backdrop-blur z-10 sticky top-0 shrink-0">
            <h2 className="font-headline-md text-base font-semibold text-primary">CloudGuard Copilot</h2>
          </div>

          {/* Chat Scroll Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-margin-page flex flex-col gap-4 p-6 space-y-4">
            
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-stack-md max-w-3xl ${
                  msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {/* Avatar */}
                {msg.sender === 'user' ? (
                  <img 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-outline-variant mt-1"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXYyfWhXwysmxydMtXRTZFljb18smSvlAHZRp0M6Kmn5yuW55fBdOHR95WuDoXrrmwqxzq7LnKq_937ZvVCCshg4cGxsFcfD9mAE_XW2De81FSdmF8rIsR6cvuoWWvZ85xew-yyJLBzFW49XOVf1MXhDXm77Y_4zAoL87YeQsNyQaA6WPfuKO1my5m1k-7PpGIqCl48RCgqx8PPuaa-2w9k2lIHMvQGFr8r5To0MENtl9vFwaaUazA0w" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center flex-shrink-0 mt-1 border border-primary text-primary">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={`p-stack-md border border-outline-variant rounded-xl p-4 flex flex-col gap-2 ${
                    msg.sender === 'user' 
                      ? 'bg-neutral-900 rounded-tr-none' 
                      : 'bg-surface-container-low rounded-tl-none shadow-[0_4px_24px_rgba(64,138,113,0.05)]'
                  }`}
                >
                  {/* Header/Title if AI summary card */}
                  {msg.title && (
                    <div className="flex justify-between items-start mb-1 gap-4">
                      <h4 className="font-semibold text-primary text-sm">{msg.title}</h4>
                      {msg.badge && (
                        <span className="bg-error-container/20 text-error border border-error/50 font-label-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
                          {msg.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Code block if any */}
                  {msg.codeBlock && (
                    <div className="bg-[#0a0f1c] border border-[#38342c] rounded mt-2 overflow-hidden">
                      <div className="flex justify-between items-center px-3 py-1.5 border-b border-[#38342c] bg-[#111827]">
                        <span className="font-label-mono text-outline-variant text-[11px] font-mono">{msg.codeBlock.header}</span>
                        <button className="text-outline-variant hover:text-primary transition-colors flex items-center gap-1 text-[11px] font-mono">
                          <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                        </button>
                      </div>
                      <pre className="p-3 overflow-x-auto text-xs font-mono text-on-surface-variant leading-relaxed">
                        <code>{msg.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Actions buttons */}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-[#38342c]/50">
                      {msg.actions.map((act) => (
                        <button 
                          key={act}
                          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded transition-colors text-xs font-medium"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {act.includes('Fix') ? 'build' : act.includes('Scan') ? 'radar' : 'description'}
                          </span>
                          {act}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-stack-md self-start">
                <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center flex-shrink-0 mt-1 border border-primary text-primary">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div className="bg-surface-container-low rounded-t-xl rounded-br-xl p-4 border border-outline-variant rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

          </div>

          {/* Chat Input Area */}
          <div className="p-margin-page bg-gradient-to-t from-background to-transparent border-t border-outline-variant/30 relative shrink-0 p-4">
            <form onSubmit={handleSend} className="relative bg-neutral-900 border border-outline-variant rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-lg flex flex-col">
              <textarea 
                className="w-full bg-transparent text-sm p-4 min-h-[60px] max-h-32 resize-none focus:outline-none focus:ring-0 border-none placeholder:text-outline-variant text-on-surface" 
                placeholder="Ask CloudGuard Copilot to analyze logs, draft policies, or explain threats..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="flex justify-between items-center p-2 border-t border-outline-variant/50 bg-[#0c0c0c] rounded-b-xl">
                <div className="flex gap-1">
                  <button type="button" className="p-1.5 rounded text-outline-variant hover:text-primary hover:bg-neutral-800 transition-colors" title="Attach File or Log">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button type="button" className="p-1.5 rounded text-outline-variant hover:text-primary hover:bg-neutral-800 transition-colors" title="Voice Command">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-on-primary p-1.5 px-3 rounded flex items-center gap-2 transition-colors font-medium text-sm">
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] font-label-mono text-outline-variant">AI can make mistakes. Verify critical security configurations.</span>
            </div>
          </div>
        </section>

        {/* Column 3: Contextual Intelligence (Right Sidebar) */}
        <aside className="w-80 bg-surface border-l border-outline-variant flex-shrink-0 flex flex-col h-full hidden xl:flex">
          <div className="p-stack-md border-b border-outline-variant h-16 flex items-center shrink-0 px-4">
            <h3 className="font-headline-sm text-sm font-semibold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
              Contextual Intelligence
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-stack-md flex flex-col gap-4 p-4 space-y-4">
            
            {/* System Health Panel */}
            <div className="bg-neutral-900/30 border border-outline-variant rounded p-3">
              <h4 className="font-label-mono text-xs uppercase text-outline-variant mb-3 flex items-center gap-2 text-[10px]">
                <span className="material-symbols-outlined text-[14px]">monitor_heart</span> System Health
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Active Scanners</span>
                  <span className="text-primary font-medium">12/12 Online</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full"></div>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-on-surface-variant">Log Ingestion Delay</span>
                  <span className="text-primary font-medium">42ms</span>
                </div>
              </div>
            </div>

            {/* Active Model Status */}
            <div className="bg-neutral-900/30 border border-outline-variant rounded p-3">
              <h4 className="font-label-mono text-xs uppercase text-outline-variant mb-3 flex items-center gap-2 text-[10px]">
                <span className="material-symbols-outlined text-[14px]">memory</span> Active Model
              </h4>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/30 flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                </div>
                <div>
                  <div className="font-medium text-xs text-on-surface">Gemini 1.5 Pro SecOps</div>
                  <div className="text-[10px] text-on-surface-variant mt-1">Context Window: 1M tokens</div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    <span className="text-[9px] font-label-mono text-outline-variant uppercase">Optimal Latency</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Sources */}
            <div className="bg-neutral-900/30 border border-outline-variant rounded p-3 flex-1">
              <h4 className="font-label-mono text-xs uppercase text-outline-variant mb-3 flex items-center gap-2 text-[10px]">
                <span className="material-symbols-outlined text-[14px]">library_books</span> Reference Sources
              </h4>
              <p className="text-[10px] text-on-surface-variant mb-3">Utilizing security guidelines framework:</p>
              <div className="flex flex-col gap-2 space-y-2">
                <div className="flex items-center gap-2 p-2 rounded bg-neutral-950 border border-[#38342c] hover:border-primary transition-colors cursor-pointer text-on-surface">
                  <span className="material-symbols-outlined text-outline text-[16px]">menu_book</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate">NIST SP 800-53 Rev. 5</div>
                    <div className="text-[9px] text-on-surface-variant truncate">Access Control Family</div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[14px]">open_in_new</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-neutral-950 border border-[#38342c] hover:border-primary transition-colors cursor-pointer text-on-surface">
                  <span className="material-symbols-outlined text-outline text-[16px]">cloud</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate">AWS IAM Best Practices</div>
                    <div className="text-[9px] text-on-surface-variant truncate">Least Privilege Principle</div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[14px]">open_in_new</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
};

export default ChatPage;
