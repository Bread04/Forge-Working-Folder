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
import { Brain } from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import ChatSidebar from '@/components/chat/ChatSidebar';
import SkillNode from '@/components/graph/SkillNode';
import ZeroGModal from '@/components/graph/ZeroGModal';
import BlurtingCanvas from '@/components/focus/BlurtingCanvas';
import FeynmanExplainer from '@/components/focus/FeynmanExplainer';
import ReviseContent from '@/components/focus/ReviseContent';
import UnderstandContent from '@/components/focus/UnderstandContent';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [showBlurting, setShowBlurting] = useState(false);
  const [studyTab, setStudyTab] = useState<'blurt' | 'feynman' | 'revise' | 'understand'>('understand');

  const onNodeClick = (_: any, node: any) => {
    setSelectedNodeData(node.data);
    setIsModalOpen(false);
    setShowBlurting(true);
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

                {studyTab === 'understand' ? (
                  <UnderstandContent nodeName={selectedNodeData.label} />
                ) : studyTab === 'revise' ? (
                  <ReviseContent 
                    nodeName={selectedNodeData.label} 
                    context={{
                      parents: ["Computer Science"],
                      children: ["Syntax", "Logic"],
                      siblings: ["C++", "Python"]
                    }}
                  />
                ) : studyTab === 'blurt' ? (
                  <BlurtingCanvas 
                    nodeName={selectedNodeData.label} 
                    sourceContent="Sample source context..." 
                  />
                ) : (
                  <FeynmanExplainer nodeName={selectedNodeData.label} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedNodeData && (
          <ZeroGModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            nodeName={selectedNodeData.label}
            content={selectedNodeData.zero_g_content}
          />
        )}

        {/* Modal removed on click per user request */}
      </main>

      <ChatSidebar />
    </div>
  );
}
