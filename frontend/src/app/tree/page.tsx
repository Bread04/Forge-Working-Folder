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
import FeynmanExplainer from '@/components/focus/FeynmanExplainer';
import ReviseContent from '@/components/focus/ReviseContent';
import UnderstandContent from '@/components/focus/UnderstandContent';
import SparringChallengeModal from '@/components/focus/SparringChallengeModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useTreeStore } from '@/store/useTreeStore';
import { useEffect } from 'react';

const nodeTypes = {
  skill: SkillNode,
};

const initialNodes = [
  { 
    id: 'root', 
    type: 'skill',
    position: { x: 250, y: 0 }, 
    data: { 
      label: 'Computer Science', 
      mastery_score: 85,
      zero_g_content: {
        analogy_expansion: "CS is like building a Dyson Sphere for data, capturing every bit of energy to power civilization's momentum.",
        tether_action: "Build complex systems that automate the future.",
        swipe_quiz: [
          { statement: "Computers use binary.", is_true: true },
          { statement: "RAM is permanent storage.", is_true: false },
          { statement: "CPUs process data.", is_true: true },
          { statement: "Python is a snake only.", is_true: false },
        ]
      }
    } 
  },
  { 
    id: 'child1', 
    type: 'skill',
    position: { x: 50, y: 150 }, 
    data: { 
      label: 'Java Basics', 
      mastery_score: 95,
      zero_g_content: {
        analogy_expansion: "Java is the orbital mechanics of code: static, reliable, and keeps everything in its exact gravitational path.",
        tether_action: "Craft enterprise-grade software that stands the test of time.",
        swipe_quiz: [
          { statement: "Java has pointers.", is_true: false },
          { statement: "JVM runs bytecode.", is_true: true },
          { statement: "Java is compiled.", is_true: true },
          { statement: "Objects are blueprint instances.", is_true: true },
        ]
      }
    } 
  },
  { 
    id: 'child2', 
    type: 'skill',
    position: { x: 450, y: 150 }, 
    data: { 
      label: 'Object Oriented', 
      mastery_score: 45,
      zero_g_content: {
        analogy_expansion: "OOP is modular space station design: you build self-contained modules that dock together to form a greater whole.",
        tether_action: "Organize code into reusable, scalable archetypes.",
        swipe_quiz: [
          { statement: "Classes are objects.", is_true: false },
          { statement: "Inheritance shares logic.", is_true: true },
          { statement: "Encapsulation hides data.", is_true: true },
          { statement: "Polymorphism is magic.", is_true: false },
        ]
      }
    } 
  },
];

const initialEdges = [
  { 
    id: 'e-root-child1', 
    source: 'root', 
    target: 'child1',
    animated: true,
    style: { stroke: '#43261a', strokeWidth: 3 },
  },
  { 
    id: 'e-root-child2', 
    source: 'root', 
    target: 'child2',
    style: { stroke: '#43261a', strokeWidth: 3 },
  },
];

export default function TreeView() {
  const storeNodes = useTreeStore((state) => state.nodes);
  const setTreeData = useTreeStore((state) => state.setTreeData);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [studyTab, setStudyTab] = useState<'blurt' | 'feynman' | 'revise' | 'understand'>('understand');

  const isBeginnerMind = useTreeStore((state) => state.isBeginnerMind);
  const toggleBeginnerMind = useTreeStore((state) => state.toggleBeginnerMind);
  const isSparringMode = useTreeStore((state) => state.isSparringMode);
  const toggleSparringMode = useTreeStore((state) => state.toggleSparringMode);

  const [isSparringChallengeOpen, setIsSparringChallengeOpen] = useState(false);

  const selectedNodeData = useMemo(() => {
    return storeNodes.find(n => n.node_id === selectedNodeId);
  }, [storeNodes, selectedNodeId]);

  // Sync initial nodes to store if empty
  useEffect(() => {
    if (storeNodes.length === 0) {
      const formattedNodes: any = initialNodes.map(n => ({
        node_id: n.id,
        parent_id: null, // Simplification for mock
        topic_name: n.data.label,
        related_node_ids: [],
        mastery_score: n.data.mastery_score,
        zero_g_content: n.data.zero_g_content
      }));
      setTreeData("Computer Science", formattedNodes);
    }
  }, [storeNodes.length, setTreeData]);

  // Sync store nodes to ReactFlow nodes
  useEffect(() => {
    setNodes(storeNodes.map(n => ({
      id: n.node_id,
      type: 'skill',
      position: initialNodes.find(inNode => inNode.id === n.node_id)?.position || { x: 0, y: 0 },
      data: { 
        label: n.topic_name, 
        mastery_score: n.mastery_score,
        zero_g_content: n.zero_g_content
      }
    })));
  }, [storeNodes, setNodes]);

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
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Skill Tree</h1>
            <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Visualize your path to mastery</p>
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
                    onClick={() => setStudyTab('understand')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'understand' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Understand
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
                    onClick={() => setStudyTab('feynman')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${studyTab === 'feynman' ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
                  >
                    Feynman
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

                {studyTab === 'understand' ? (
                  <UnderstandContent nodeName={selectedNodeData.topic_name} nodeId={selectedNodeId!} />
                ) : studyTab === 'revise' ? (
                  <ReviseContent 
                    nodeName={selectedNodeData.topic_name} 
                    nodeId={selectedNodeId!}
                    context={{
                      parents: ["Computer Science"],
                      children: ["Syntax", "Logic"],
                      siblings: ["C++", "Python"]
                    }}
                  />
                ) : studyTab === 'blurt' ? (
                  <BlurtingCanvas 
                    nodeName={selectedNodeData.topic_name} 
                    nodeId={selectedNodeId!}
                    sourceContent="Sample source context..." 
                  />
                ) : (
                  <FeynmanExplainer nodeName={selectedNodeData.topic_name} nodeId={selectedNodeId!} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedNodeData && (
          <ZeroGModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            nodeName={selectedNodeData.topic_name}
            nodeId={selectedNodeId!}
            content={selectedNodeData.zero_g_content}
          />
        )}

        {selectedNodeData && (
          <SparringChallengeModal 
            isOpen={isSparringChallengeOpen}
            onClose={() => setIsSparringChallengeOpen(false)}
            nodeName={selectedNodeData.topic_name}
          />
        )}

        {/* Modal removed on click per user request */}
      </main>

      <ChatSidebar />
    </div>
  );
}
