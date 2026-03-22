"use client";

import Sidebar from '@/components/layout/Sidebar';
import PomodoroTimer from '@/components/focus/PomodoroTimer';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { Zap, Target, TrendingUp, Trophy, Upload, Loader2, Database } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTreeStore } from '@/store/useTreeStore';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [persistentTrees, setPersistentTrees] = useState<{id: string; title: string; created_at: string}[]>([]);
  const [isLoadingTrees, setIsLoadingTrees] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addTree = useTreeStore(state => state.addTree);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8000/api/trees')
      .then(res => res.json())
      .then(data => {
        setPersistentTrees(data.trees || []);
        setIsLoadingTrees(false);
      })
      .catch(err => {
        console.error("Failed fetching trees:", err);
        setIsLoadingTrees(false);
      });
  }, []);

  const handleLoadTree = async (treeId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/trees/${treeId}`);
      if (!response.ok) throw new Error("Failed to load tree");
      const data = await response.json();
      addTree(data); 
      router.push('/tree');
    } catch (error) {
      console.error("Failed loading tree:", error);
      alert("Error loading the mapped tree from backend.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/extract-graph', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      
      const pdfUrl = URL.createObjectURL(file);
      const newTreeData = {
        id: data.tree_id || Date.now().toString(),
        title: data.documentTitle || file.name.replace('.pdf', ''),
        nodes: data.nodes || [],
        edges: data.edges || [],
        pdfUrl
      };
      
      addTree(newTreeData);
      
      router.push('/tree');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error processing PDF. Please check your API keys and try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#1a0b06] text-[#f9e8d2]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-10 space-y-10">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Command Center</h1>
            <p className="text-[#f9a84d] text-sm font-bold uppercase tracking-widest opacity-60">Ready to forge some focus, Alex?</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#2d150d] border border-[#43261a] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ffd700]/10 rounded-xl flex items-center justify-center text-[#ffd700]">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase">Daily Goal</p>
                <p className="text-white font-black">4h 12m</p>
              </div>
            </div>
            <div className="bg-[#2d150d] border border-[#43261a] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase">Streak</p>
                <p className="text-white font-black">12 Days</p>
              </div>
            </div>
          </div>
        </header>

        {/* Focus Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="forge-card relative overflow-hidden h-[400px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#2d150d] to-transparent opacity-50" />
              <div className="relative z-10 w-full max-w-md">
                <PomodoroTimer />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
               <div className="forge-card flex items-center gap-6">
                 <div className="w-16 h-16 bg-[#f9a84d]/10 rounded-2xl flex items-center justify-center text-[#f9a84d]">
                   <Zap size={32} />
                 </div>
                 <div>
                   <h3 className="text-white font-black uppercase tracking-tighter leading-none mb-1 text-xl">Skills Mastered</h3>
                   <p className="text-[#f9a84d] font-bold">12 Active Nodes</p>
                 </div>
               </div>
               
               {/* PDF Upload Card */}
               <div className="forge-card flex flex-col justify-center items-center gap-4 border-dashed border-2 hover:border-[#f9a84d]/50 transition-colors cursor-pointer relative"
                    onClick={() => !isUploading && fileInputRef.current?.click()}
               >
                 <input 
                   type="file" 
                   accept="application/pdf"
                   className="hidden" 
                   ref={fileInputRef}
                   onChange={handleFileUpload}
                 />
                 <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                   {isUploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                 </div>
                 <div className="text-center">
                   <h3 className="text-white font-black uppercase tracking-tighter leading-none mb-1 text-xl">
                     {isUploading ? 'Forging Tree...' : 'Upload Notes'}
                   </h3>
                   <p className="text-indigo-400 font-bold text-xs">PDF to Skill Tree</p>
                 </div>
               </div>
            </div>

            {/* Active Core Trees */}
            <div className="forge-card border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-3 mb-6">
                <Database className="text-indigo-400" />
                <h2 className="text-xl font-black uppercase tracking-tighter italic">Persistent Memory Trees</h2>
              </div>
              {isLoadingTrees ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-400" /></div>
              ) : persistentTrees.length === 0 ? (
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest text-center py-8">No Neo-Graphs in memory. Upload notes to begin.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {persistentTrees.map(tree => (
                    <button 
                      key={tree.id}
                      onClick={() => handleLoadTree(tree.id)}
                      className="text-left p-5 border border-indigo-500/20 hover:border-indigo-400/50 bg-[#1a0b06] rounded-2xl transition-all group hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-3xl" />
                      <h4 className="text-[#f9e8d2] font-black uppercase leading-tight mb-2 group-hover:text-indigo-400 transition-colors relative z-10 truncate">{tree.title}</h4>
                      <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest relative z-10">
                        Generated: {new Date(tree.created_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="forge-card space-y-6">
              <h2 className="text-lg font-black uppercase tracking-tighter">Recent XP Gains</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 bg-[#f9a84d]/20 rounded-lg flex items-center justify-center text-[#f9a84d]">
                      <Zap size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate uppercase">Calculus Pulse</p>
                      <p className="text-white/30 text-[10px]">14 minutes ago</p>
                    </div>
                    <span className="text-emerald-400 font-black text-xs">+120 XP</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 border border-[#43261a] rounded-xl text-xs font-bold uppercase text-[#f9a84d] hover:bg-[#f9a84d]/5 transition-colors">
                View All History
              </button>
            </div>
          </aside>
        </div>
      </main>

      <ChatSidebar />
    </div>
  );
}
