import { create } from 'zustand';

export interface GraphNode {
  id: string;
  title: string;
  content_markdown: string;
  zero_g_intuition: string;
  mastery_score: number;
  checklist?: { id: string, label: string, sub: string }[];
  discussion_questions?: { id: string, question: string, answer: string }[];
  mastery_checklist?: Record<string, boolean>;
  visual_context?: {
    image_base64?: string;
    explanation?: string;
  };
}

export interface GraphEdge {
  source_id: string;
  target_id: string;
  relationship_type: string;
}

export interface TreeData {
  id: string;
  title: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  pdfUrl?: string;
}

interface TreeState {
  trees: Record<string, TreeData>;
  activeTreeId: string | null; 
  activeNodeId: string | null;
  addTree: (data: TreeData) => void;
  loadTree: (data: TreeData) => void; // loads into store WITHOUT changing activeTreeId
  setActiveTree: (id: string) => void;
  setActiveNode: (id: string | null) => void;
  updateMastery: (nodeId: string, score: number) => void;
  adjustMastery: (nodeId: string, delta: number) => void;
  isBeginnerMind: boolean;
  toggleBeginnerMind: () => void;
  isSparringMode: boolean;
  toggleSparringMode: () => void;
  toggleChecklistItem: (nodeId: string, itemKey: string) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  trees: {},
  activeTreeId: null,
  activeNodeId: null,
  isBeginnerMind: false,
  isSparringMode: false,
  addTree: (data) => set((state) => ({
    trees: { ...state.trees, [data.id]: data },
    activeTreeId: data.id 
  })),
  loadTree: (data) => set((state) => ({
    trees: { ...state.trees, [data.id]: data },
    // Does NOT change activeTreeId
  })),
  setActiveTree: (id) => set({ activeTreeId: id, activeNodeId: null }),
  setActiveNode: (id) => set({ activeNodeId: id }),
  updateMastery: (nodeId, score) => set((state) => {
    if (!state.activeTreeId) return state;
    const currentTree = state.trees[state.activeTreeId];
    if (!currentTree) return state;
    return {
      trees: {
        ...state.trees,
        [state.activeTreeId]: {
          ...currentTree,
          nodes: currentTree.nodes.map((n) => 
            n.id === nodeId ? { ...n, mastery_score: Math.min(100, Math.max(0, score)) } : n
          )
        }
      }
    };
  }),
  adjustMastery: (nodeId, delta) => set((state) => {
    if (!state.activeTreeId) return state;
    const currentTree = state.trees[state.activeTreeId];
    if (!currentTree) return state;
    return {
      trees: {
        ...state.trees,
        [state.activeTreeId]: {
          ...currentTree,
          nodes: currentTree.nodes.map((n) => 
            n.id === nodeId 
              ? { ...n, mastery_score: Math.min(100, Math.max(0, (n.mastery_score || 0) + delta)) } 
              : n
          )
        }
      }
    };
  }),
  toggleBeginnerMind: () => set((state) => ({ isBeginnerMind: !state.isBeginnerMind })),
  toggleSparringMode: () => set((state) => ({ isSparringMode: !state.isSparringMode })),
  toggleChecklistItem: (nodeId, itemKey) => set((state) => {
    if (!state.activeTreeId) return state;
    const currentTree = state.trees[state.activeTreeId];
    if (!currentTree) return state;
    
    return {
      trees: {
        ...state.trees,
        [state.activeTreeId]: {
          ...currentTree,
          nodes: currentTree.nodes.map((n) => {
            if (n.id !== nodeId) return n;
            const newChecklist = {
              ...(n.mastery_checklist || {}),
              [itemKey]: !(n.mastery_checklist?.[itemKey] ?? false)
            };
            
            // Auto-update mastery score based on checklist
            const checkedCount = Object.values(newChecklist).filter(Boolean).length;
            const totalItems = n.checklist?.length || 1; // avoid div by 0
            const newScore = Math.floor((checkedCount / totalItems) * 100);
            
            return { 
              ...n, 
              mastery_checklist: newChecklist,
              mastery_score: newScore
            };
          })
        }
      }
    };
  }),
}));
