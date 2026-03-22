"use client";

import React, { useState, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Swords } from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import ChatSidebar from '@/components/chat/ChatSidebar';
import SkillNode from '@/components/graph/SkillNode';
import ZeroGModal from '@/components/graph/ZeroGModal';
import BlurtingCanvas from '@/components/focus/BlurtingCanvas';
import LinksAndMore from '@/components/focus/LinksAndMore';
import ReviseContent from '@/components/focus/ReviseContent';
import UnderstandContent from '@/components/focus/UnderstandContent';
import AboutContent from '@/components/focus/AboutContent';
import SparringChallengeModal from '@/components/focus/SparringChallengeModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useTreeStore } from '@/store/useTreeStore';
import { useEffect } from 'react';

const nodeTypes = {
  skill: SkillNode,
};

const initialTreeData = {
  nodes: [
    { 
      id: 'root', 
      title: 'Computer Science', 
      content_markdown: 'Computer science is the study of computational systems...',
      zero_g_intuition: "CS is like building a Dyson Sphere for data, capturing every bit of energy to power civilization's momentum.",
      mastery_score: 85
    },
    { 
      id: 'child1', 
      title: 'Java Basics', 
      content_markdown: 'Java is a robust, object-oriented programming language.',
      zero_g_intuition: "Java is the orbital mechanics of code: static, reliable, and keeps everything in its exact gravitational path.",
      mastery_score: 95
    },
    { 
      id: 'child2', 
      title: 'Object Oriented', 
      content_markdown: 'OOP conceptualizes software as interacting objects.',
      zero_g_intuition: "OOP is modular space station design: you build self-contained modules that dock together to form a greater whole.",
      mastery_score: 45
    },
  ],
  edges: [
    { 
      source_id: 'root', 
      target_id: 'child1',
      relationship_type: 'Prerequisite'
    },
    { 
      source_id: 'root', 
      target_id: 'child2',
      relationship_type: 'Related'
    },
  ]
};

export default function TreeView() {
  const trees = useTreeStore((state) => state.trees);
  const activeTreeId = useTreeStore((state) => state.activeTreeId);
  const setActiveTree = useTreeStore((state) => state.setActiveTree);
  const addTree = useTreeStore((state) => state.addTree);
  const loadTree = useTreeStore((state) => state.loadTree);
  
  const storeNodes = useMemo(() => {
    return (activeTreeId && trees[activeTreeId] && trees[activeTreeId].nodes) ? trees[activeTreeId].nodes : [];
  }, [trees, activeTreeId]);
  
  const storeEdges = useMemo(() => {
    return (activeTreeId && trees[activeTreeId] && trees[activeTreeId].edges) ? trees[activeTreeId].edges : [];
  }, [trees, activeTreeId]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [studyTab, setStudyTab] = useState<'about' | 'understand' | 'revise' | 'blurt' | 'links'>('about');

  const isBeginnerMind = useTreeStore((state) => state.isBeginnerMind);
  const toggleBeginnerMind = useTreeStore((state) => state.toggleBeginnerMind);
  const isSparringMode = useTreeStore((state) => state.isSparringMode);
  const toggleSparringMode = useTreeStore((state) => state.toggleSparringMode);

  const [isSparringChallengeOpen, setIsSparringChallengeOpen] = useState(false);

  const selectedNodeData = useMemo(() => {
    if (!storeNodes) return undefined;
    return storeNodes.find(n => n.id === selectedNodeId);
  }, [storeNodes, selectedNodeId]);

  // Fetch the list of trees for the dropdown (metadata only, no full data)
  const [persistentTreeList, setPersistentTreeList] = useState<{id: string; title: string}[]>([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/trees')
      .then(res => res.json())
      .then(data => {
        if (data.trees) setPersistentTreeList(data.trees);
      })
      .catch(err => console.error("Failed fetching tree list:", err));
  }, []);

  // If no active tree is set but we have trees in the store, pick the first one
  useEffect(() => {
    if (!activeTreeId && Object.keys(trees).length > 0) {
      setActiveTree(Object.keys(trees)[0]);
    }
  }, [trees, activeTreeId, setActiveTree]);

  // Load a tree from the server when user picks from dropdown
  const handleDropdownChange = async (treeId: string) => {
    if (trees[treeId]) {
      // Already in store — just activate it
      setActiveTree(treeId);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/trees/${treeId}`);
      const data = await res.json();
      loadTree(data);
      setActiveTree(treeId);
    } catch (e) {
      console.error("Failed loading tree:", e);
    }
  };
  // Sync store nodes to ReactFlow nodes
  useEffect(() => {
    setNodes(storeNodes.map((n, i) => ({
      id: n.id,
      type: 'skill',
      position: { x: (i % 3) * 200, y: Math.floor(i / 3) * 150 }, // Auto-layout calculation for now
      data: { 
        label: n.title, 
        mastery_score: n.mastery_score,
        zero_g_content: n.zero_g_intuition // Pass the string directly
      }
    })));
    
    setEdges(storeEdges.map((e, i) => ({
      id: `e-${e.source_id}-${e.target_id}-${i}`,
      source: e.source_id,
      target: e.target_id,
      animated: true,
      style: { stroke: '#43261a', strokeWidth: 3 },
      label: e.relationship_type,
      labelStyle: { fill: '#f9a84d', fontWeight: 700, fontSize: 10 },
      labelBgStyle: { fill: '#2d150d', color: '#fff', fillOpacity: 0.8 },
      labelBgPadding: [4, 4],
      labelBgBorderRadius: 4,
    })));
  }, [storeNodes, storeEdges, setNodes, setEdges]);

  const onNodeClick = (_: any, node: any) => {
    if (isSparringMode) {
      setSelectedNodeId(node.id);
      setIsSparringChallengeOpen(true);
      setIsModalOpen(false);
    } else {
      setSelectedNodeId(node.id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#1a0b06] text-[#f9e8d2]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="p-8 border-b border-[#43261a] flex justify-between items-center bg-[#1a0b06]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              Skill Tree
              {Object.keys(trees).length > 0 && (
                <select 
                  className="ml-4 text-lg bg-[#2d150d] border border-[#43261a] text-[#f9a84d] rounded-xl px-4 py-2 font-black uppercase tracking-widest outline-none"
                  value={activeTreeId || ''}
                  onChange={(e) => setActiveTree(e.target.value)}
                >
                  {Object.values(trees).map(tree => (
                    <option key={tree.id} value={tree.id}>{tree.title}</option>
                  ))}
                </select>
              )}
            </h1>
            <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Visualize your path to mastery</p>
          </div>
          <button className="bg-[#2d150d] border border-[#43261a] text-white/60 px-6 py-2 rounded-xl text-xs font-bold uppercase hover:text-white hover:border-[#f9a84d]/50 transition-all">
            Recenter View
          </button>
        </header>

        <div className="flex-1 flex gap-8 p-8 relative overflow-hidden">
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
            >
              <Background color="#43261a" gap={30} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>

          <AnimatePresence>
            {selectedNodeData && (
              <motion.div 
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="w-[450px] z-20 space-y-6"
              >
                <div className="flex gap-2 p-1 bg-[#2d150d] rounded-xl border border-[#43261a]">
                  <button 
                    onClick={() => setStudyTab('about')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'about' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => setStudyTab('understand')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'understand' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Learn
                  </button>
                  <button 
                    onClick={() => setStudyTab('revise')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'revise' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Revise
                  </button>
                  <button 
                    onClick={() => setStudyTab('blurt')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'blurt' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Blurt
                  </button>
                  <button 
                    onClick={() => setStudyTab('links')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'links' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Links
                  </button>
                </div>

                {/* Beginner's Mind Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#2d150d] rounded-2xl border border-[#f9a84d]/20 shadow-[0_0_20px_rgba(249,168,77,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isBeginnerMind ? 'bg-[#f9a84d] text-[#1a0b06]' : 'bg-white/5 text-white/40'}`}>
                      <Brain size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f9e8d2]">Beginner's Mind</h4>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-[#f9a84d]/60">The Intelligent Fool Mode</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleBeginnerMind()}
                    className={`relative w-10 h-5 rounded-full transition-colors ${isBeginnerMind ? 'bg-[#f9a84d]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBeginnerMind ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* Sparring Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#2d150d] rounded-2xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isSparringMode ? 'bg-red-500 text-white' : 'bg-white/5 text-white/40'}`}>
                      <Swords size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#f9e8d2]">Sparring Mode</h4>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-red-500/60">The AI Spotter is Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSparringMode()}
                    className={`relative w-10 h-5 rounded-full transition-colors ${isSparringMode ? 'bg-red-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isSparringMode ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {studyTab === 'about' ? (
                  <AboutContent 
                    nodeId={selectedNodeId!}
                    nodeName={selectedNodeData.title} 
                    content={selectedNodeData.content_markdown}
                    pdfUrl={activeTreeId ? trees[activeTreeId]?.pdfUrl : undefined}
                  />
                ) : studyTab === 'understand' ? (
                  <UnderstandContent nodeName={selectedNodeData.title} nodeId={selectedNodeId!} />
                ) : studyTab === 'revise' ? (
                  <ReviseContent 
                    nodeName={selectedNodeData.title} 
                    nodeId={selectedNodeId!}
                    context={{
                      parents: ["Computer Science"],
                      children: ["Syntax", "Logic"],
                      siblings: ["C++", "Python"]
                    }}
                  />
                ) : studyTab === 'blurt' ? (
                  <BlurtingCanvas 
                    nodeName={selectedNodeData.title} 
                    nodeId={selectedNodeId!}
                    sourceContent="Sample source context..." 
                  />
                ) : (
                  <LinksAndMore nodeName={selectedNodeData.title} nodeId={selectedNodeId!} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedNodeData && (
          <ZeroGModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            nodeName={selectedNodeData.title}
            nodeId={selectedNodeId!}
            content={selectedNodeData.zero_g_intuition}
          />
        )}

        {selectedNodeData && (
          <SparringChallengeModal 
            isOpen={isSparringChallengeOpen}
            onClose={() => setIsSparringChallengeOpen(false)}
            nodeName={selectedNodeData.title}
          />
        )}

        {/* Modal removed on click per user request */}
      </main>

      <ChatSidebar />
    </div>
  );
}
