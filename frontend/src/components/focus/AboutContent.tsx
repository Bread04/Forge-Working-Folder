import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Compass, Cpu, FlaskConical, Zap, AlertTriangle, ExternalLink,
  PencilLine, ChevronDown, ChevronUp, Eye, EyeOff, Brain, CheckCircle2, Circle, Trophy,
  Image as ImageIcon, BookOpen
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { useTreeStore, GraphNode } from '../../store/useTreeStore';

interface AboutContentProps {
  nodeId: string;
  nodeName: string;
  content: string;
  pdfUrl?: string;
}


// --- Config for parsing section headers emitted by the AI ---
const SECTION_DEFS = [
  {
    key: 'hook',
    match: /##\s*🌌\s*Zero-G Hook/i,
    label: '🌌 Zero-G Hook',
    icon: Compass,
    color: '#7c3aed',     // violet
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.25)',
  },
  {
    key: 'definitions',
    match: /##\s*📖\s*Key Definitions/i,
    label: '📖 Key Definitions',
    icon: BookOpen,
    color: '#a78bfa',     // violet-400
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.25)',
  },
  {
    key: 'mechanics',
    match: /##\s*📊\s*Core Mechanics/i,
    label: '📊 Core Mechanics',
    icon: Cpu,
    color: '#f9a84d',     // amber
    bg: 'rgba(249,168,77,0.07)',
    border: 'rgba(249,168,77,0.25)',
  },
  {
    key: 'derivation',
    match: /##\s*(?:🔬|✍️)?\s*Technical Derivation/i,
    label: '🔬 Technical Derivation',
    icon: FlaskConical,
    color: '#38bdf8',     // sky
    bg: 'rgba(56,189,248,0.07)',
    border: 'rgba(56,189,248,0.25)',
  },
  {
    key: 'example',
    match: /##\s*💡\s*Worked Example(s)?/i,
    label: '💡 Examples from Notes',
    icon: Zap,
    color: '#4ade80',     // green
    bg: 'rgba(74,222,128,0.07)',
    border: 'rgba(74,222,128,0.25)',
  },
  {
    key: 'visual_context',
    match: /##\s*🖼️?\s*Visual Context/i,
    label: '🖼️ Visual Context',
    icon: ImageIcon,
    color: '#ec4899',     // pink
    bg: 'rgba(236,72,153,0.07)',
    border: 'rgba(236,72,153,0.25)',
  },
  {
    key: 'pitfalls',
    match: /##\s*⚠️?\s*Common Pitfalls/i,
    label: '⚠️ Common Pitfalls',
    icon: AlertTriangle,
    color: '#f87171',     // red
    bg: 'rgba(248,113,113,0.07)',
    border: 'rgba(248,113,113,0.25)',
  },
  {
    key: 'bridge',
    match: /##\s*🎥\s*Smart Bridge/i,
    label: '🎥 Smart Bridge',
    icon: Zap,
    color: '#0ea5e9',     // sky-500
    bg: 'rgba(14,165,233,0.07)',
    border: 'rgba(14,165,233,0.25)',
  },
  {
    key: 'questions',
    match: /##\s*⚔️\s*Familiarization Questions/i,
    label: '⚔️ Familiarization Questions',
    icon: Zap,
    color: '#fbbf24',     // amber-400
    bg: 'rgba(251,191,36,0.07)',
    border: 'rgba(251,191,36,0.25)',
  },
  {
    key: 'practice',
    match: /##\s*📝\s*Exam-Style Practice/i,
    label: '📝 Exam-Style Practice',
    icon: PencilLine,
    color: '#22c55e',     // green-500
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.25)',
  },
  {
    key: 'links',
    match: /##\s*🔗\s*Further Reading/i,
    label: '🔗 Further Reading',
    icon: ExternalLink,
    color: '#a78bfa',     // purple
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.25)',
  },
] as const;

function MasteryChecklist({ nodeId }: { nodeId: string }) {
  const node = useTreeStore(state => {
    const tree = state.trees[state.activeTreeId || ''];
    return tree?.nodes.find(n => n.id === nodeId);
  });
  const toggle = useTreeStore(state => state.toggleChecklistItem);

  if (!node) return null;
  const checklistItems = node.checklist && node.checklist.length > 0 ? node.checklist : [];
  if (checklistItems.length === 0) return null;
  
  const checklist = node.mastery_checklist || {};
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const allMastered = completedCount > 0 && completedCount === checklistItems.length;

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 bg-[#f9a84d]/5 border border-[#f9a84d]/20">
      <div className="flex items-center gap-2 border-b border-[#f9a84d]/10 pb-3">
        <Trophy size={16} className={allMastered ? "text-yellow-400 animate-bounce" : "text-[#f9a84d]/40"} />
        <h3 className="text-xs font-black uppercase tracking-widest text-[#f9a84d]">FocusFlow Mastery Checklist</h3>
        <span className="text-[10px] bg-[#f9a84d]/20 text-[#f9a84d] px-2 py-0.5 rounded-full ml-auto">
          {completedCount}/{checklistItems.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {checklistItems.map((item, idx) => {
          const itemKey = item.id || `item_${idx}`;
          return (
            <button
              key={itemKey}
              onClick={() => toggle(nodeId, itemKey)}
              className="flex items-start gap-3 p-2 rounded-xl transition-all hover:bg-white/5 text-left group"
            >
              {checklist[itemKey] ? (
                <CheckCircle2 size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-white/20 mt-0.5 group-hover:text-[#f9a84d]/50 flex-shrink-0" />
              )}
              <div>
                <p className={`text-xs font-bold leading-tight ${checklist[itemKey] ? "text-white" : "text-white/60"}`}>
                  {item.label}
                </p>
                <p className="text-[10px] text-white/30 italic">{item.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {allMastered && (
        <div className="mt-2 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <Trophy size={20} className="text-yellow-400" />
          <p className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">
            Node Mastered!<br/><span className="text-yellow-400 opacity-80">Gold Status Achieved on Map</span>
          </p>
        </div>
      )}
    </div>
  );
}

function DiscussionItem({ question, answer }: { question: string, answer: string }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-[#f9e8d2] font-semibold">{question}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showAnswer ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400 hover:bg-amber-400/10'}`}
        >
          {showAnswer ? <EyeOff size={12} /> : <Eye size={12} />}
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </button>
      </div>
      <AnimatePresence>
        {showAnswer && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1">
                <Brain size={12} /> Socratic Answer
              </p>
              <div className="prose prose-invert prose-xs italic opacity-90">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {answer}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PracticeItem({ content }: { content: string }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Simple parsing for hint and solution
  const hintMatch = content.match(/###\s*💡\s*Hint\s*([\s\S]*?)(?=###|##|$)/i);
  const solutionMatch = content.match(/###\s*✅\s*Solution\s*([\s\S]*?)(?=###|##|$)/i);
  const questionBody = content.split(/###\s*💡\s*Hint|###\s*✅\s*Solution/i)[0];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {questionBody}
        </ReactMarkdown>
      </div>

      <div className="flex gap-2 pt-2">
        {hintMatch && (
          <button 
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showHint ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400 hover:bg-amber-400/10'}`}
          >
            {showHint ? <EyeOff size={12} /> : <Eye size={12} />}
            {showHint ? 'Hide Hint' : 'Reveal Hint'}
          </button>
        )}
        {solutionMatch && (
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showSolution ? 'bg-green-500 text-white' : 'bg-white/5 text-green-500 hover:bg-green-500/10'}`}
          >
            {showSolution ? <EyeOff size={12} /> : <Eye size={12} />}
            {showSolution ? 'Hide Solution' : 'See Solution'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showHint && hintMatch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1">
                <Brain size={12} /> Hint
              </p>
              <div className="prose prose-invert prose-xs italic opacity-80">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {hintMatch[1]}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}

        {showSolution && solutionMatch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> Correct Solution
              </p>
              <div className="prose prose-invert prose-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {solutionMatch[1]}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function parseSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: { def: typeof SECTION_DEFS[number]; lines: string[] }[] = [];
  let current: { def: typeof SECTION_DEFS[number]; lines: string[] } | null = null;

  for (const line of lines) {
    const found = SECTION_DEFS.find(d => d.match.test(line));
    if (found) {
      if (current) sections.push(current);
      current = { def: found, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  return sections;
}

// Shared markdown renderer props
const markdownComponents: any = {
  code({ node, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: '12px 0',
          borderRadius: '10px',
          fontSize: '12px',
          border: '1px solid rgba(249,168,77,0.15)',
          background: '#0d0504',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} style={{ color: '#f9a84d', background: 'rgba(0,0,0,0.4)', padding: '1px 5px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }} {...props}>
        {children}
      </code>
    );
  },
  a({ href, children }: any) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#a78bfa', textDecoration: 'underline', gap: '4px', display: 'inline-flex', alignItems: 'center' }}
      >
        {children}
        <ExternalLink size={10} style={{ marginLeft: 2 }} />
      </a>
    );
  },
};

const proseClass = `
  prose prose-invert max-w-none text-sm leading-7
  prose-headings:hidden
  prose-p:text-white/80 prose-p:my-2
  prose-strong:text-[#f9a84d] prose-strong:font-bold
  prose-em:text-white/60
  prose-li:text-white/80 prose-li:my-0.5
  prose-ul:pl-4 prose-ul:list-disc
  prose-ol:pl-4 prose-ol:list-decimal
  prose-blockquote:border-l-2 prose-blockquote:border-violet-400 prose-blockquote:pl-3 prose-blockquote:text-violet-300/80 prose-blockquote:italic prose-blockquote:my-3
  prose-table:text-xs prose-table:w-full
  prose-th:text-[#f9a84d] prose-th:font-black prose-th:uppercase prose-th:text-[10px] prose-th:tracking-widest prose-th:border-b prose-th:border-white/10 prose-th:pb-2 prose-th:text-left
  prose-td:text-white/75 prose-td:border-b prose-td:border-white/5 prose-td:py-2
  prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-xl prose-pre:overflow-hidden
`;

export default function AboutContent({ nodeId, nodeName, content, pdfUrl }: AboutContentProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  // Show a fallback if no structured sections detected
  if (sections.length === 0) {
    return (
      <div className="flex flex-col gap-4 overflow-hidden max-h-[calc(100vh-280px)]">
        <MasteryChecklist nodeId={nodeId} />
        <FallbackCard content={content} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
      {/* Node header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-[#f9a84d]/20 rounded-xl flex items-center justify-center text-[#f9a84d]">
          <FileText size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic text-[#f9e8d2] leading-tight">{nodeName}</h2>
          <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Deep Read · Visual Component Edition</p>
        </div>
      </div>

      {/* Mastery Checklist Overlay/Sidebar */}
      <MasteryChecklist nodeId={nodeId} />

      {/* Section Cards */}
      {sections.map(({ def, lines }) => {
        const Icon = def.icon;
        const body = lines.join('\n').trim();
        if (!body) return null;

        const isPitfall = def.key === 'pitfalls';
        const isBridge = def.key === 'bridge';
        const isQuestions = def.key === 'questions';
        const isPractice = def.key === 'practice';
        const cardStyle = "backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10";
        const pulseClass = isPitfall ? "animate-pulse-slow border-red-500/30" : "";
        
        // Specialized styles for interactive sections
        const socraticStyle = isQuestions ? "border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_30px_rgba(251,191,36,0.05)]" : "";
        const practiceStyle = isPractice ? "border-green-500/30 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.05)]" : "";

        // Detect YouTube link for the Bridge section
        const youtubeMatch = isBridge ? body.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:&t=(\d+))?/) : null;
        const videoId = youtubeMatch ? youtubeMatch[1] : null;
        const timestamp = youtubeMatch ? youtubeMatch[2] : '0';

        return (
          <div
            key={def.key}
            className={`rounded-2xl p-5 flex flex-col gap-3 flex-shrink-0 ${cardStyle} ${pulseClass} ${socraticStyle} ${practiceStyle}`}
            style={{ 
              background: isPitfall ? undefined : def.bg, 
              borderColor: isPitfall ? undefined : def.border 
            }}
          >
            <div className={`flex items-center gap-2 border-b pb-3`} style={{ borderColor: isPitfall ? 'rgba(248,113,113,0.3)' : def.border }}>
              <Icon size={16} style={{ color: def.color }} />
              <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: def.color }}>
                {def.label}
              </h3>
            </div>
            
            {/* Video Embed for Smart Bridge */}
            {isBridge && videoId && (
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-sky-500/20 mb-2">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?start=${timestamp}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Smart Bridge Visualization"
                />
              </div>
            )}

            {/* Visual Context Image Display */}
            {def.key === 'visual_context' && (
              <div className="w-full rounded-xl overflow-hidden border border-pink-500/20 mb-3 bg-black/20 flex flex-col">
                {/* Find the node in store to get base64 */}
                {(function() {
                   const tree = useTreeStore.getState().trees[useTreeStore.getState().activeTreeId || ''];
                   const node = tree?.nodes.find(n => n.id === nodeId);
                   if (node?.visual_context?.image_base64) {
                     return (
                       <img 
                         src={`data:image/png;base64,${node.visual_context.image_base64}`}
                         alt="Visual Context Diagram"
                         className="w-full h-auto object-contain max-h-[400px]"
                       />
                     );
                   }
                   return <div className="p-10 text-center text-white/20 text-xs italic">Capturing Visual Signal...</div>;
                })()}
              </div>
            )}

            <div className={proseClass}>
              {isPractice ? (
                <div className="flex flex-col gap-4 not-prose">
                  {body.split(/###\s*Q\d+/i)
                    .filter(q => q.trim())
                    .map((q, idx) => (
                      <PracticeItem key={idx} content={q} />
                    ))}
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={markdownComponents}
                >
                  {body}
                </ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Socratic Discussion Questions extracted from JSON */}
      {(() => {
        const tree = useTreeStore.getState().trees[useTreeStore.getState().activeTreeId || ''];
        const node = tree?.nodes.find(n => n.id === nodeId);
        if (node?.discussion_questions && node.discussion_questions.length > 0) {
          return (
            <div
              className={`rounded-2xl p-5 flex flex-col gap-3 flex-shrink-0 backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_30px_rgba(251,191,36,0.05)]`}
            >
              <div className={`flex items-center gap-2 border-b pb-3 border-yellow-500/20`}>
                <Zap size={16} className="text-amber-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-[#fbbf24]">
                  ⚔️ Familiarization Questions
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {node.discussion_questions.map((q, idx) => (
                  <DiscussionItem key={q.id || idx} question={q.question} answer={q.answer} />
                ))}
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Live PDF Source Viewer */}
      {pdfUrl && (
        <div
          className="rounded-2xl p-4 flex flex-col flex-shrink-0"
          style={{ height: '400px', background: 'rgba(249,168,77,0.05)', border: '1px solid rgba(249,168,77,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-3 flex-shrink-0 relative">
            <FileText size={14} style={{ color: '#f9a84d' }} />
            <h3 className="text-[#f9a84d] font-black uppercase tracking-widest text-xs flex-1">Source Notes</h3>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-white/50 bg-white/10 px-2 py-1 rounded-md hover:bg-white/20 hover:text-white transition-colors cursor-pointer z-10 flex items-center gap-1">
              <ExternalLink size={10} /> OPEN FULL
            </a>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-[#43261a] bg-black/50 relative">
            <object
              data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              type="application/pdf"
              className="w-full h-full border-none absolute inset-0"
            >
              <div className="p-10 text-center text-white/50 flex flex-col gap-3 items-center justify-center h-full">
                <FileText size={48} className="text-white/20 mx-auto" />
                <p className="text-xs uppercase tracking-widest font-bold">PDF Rendering Blocked</p>
                <p className="text-[10px] italic opacity-60">Your browser prevents inline PDF viewing here.</p>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-2 px-4 py-2 bg-[#f9a84d]/20 text-[#f9a84d] font-bold rounded-lg hover:bg-[#f9a84d]/30 transition-colors uppercase tracking-widest text-[10px]">
                  Open PDF Externally
                </a>
              </div>
            </object>
          </div>
        </div>
      )}
    </div>
  );
}

function FallbackCard({ content }: { content: string }) {
  return (
    <div className="bg-[#2d150d] rounded-2xl p-6 border border-[#f9a84d]/20 overflow-y-auto max-h-[calc(100vh-320px)]">
      <div className="prose prose-invert max-w-none text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
