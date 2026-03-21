import { create } from 'zustand';

interface SwipeQuiz {
  statement: string;
  is_true: boolean;
}

interface ZeroGContent {
  analogy_expansion: string;
  tether_action: string;
  swipe_quiz: SwipeQuiz[];
}

interface TreeNode {
  node_id: string;
  parent_id: string | null;
  topic_name: string;
  related_node_ids: string[];
  mastery_score: number;
  zero_g_content: ZeroGContent;
  // New relational and metadata fields
  parent_node?: { id: string, name: string };
  child_nodes?: { id: string, name: string }[];
  siblings?: { id: string, name: string }[];
  metadata?: {
    subject: string;
    tier: 'Beginner' | 'Intermediate' | 'Advanced';
    type: 'Conceptual' | 'Formulaic' | 'Code-based';
  };
  definitions?: string[];
}

interface TreeState {
  documentTitle: string;
  nodes: TreeNode[];
  activeNodeId: string | null;
  setTreeData: (title: string, nodes: TreeNode[]) => void;
  setActiveNode: (id: string | null) => void;
  updateMastery: (nodeId: string, score: number) => void;
  adjustMastery: (nodeId: string, delta: number) => void;
  isBeginnerMind: boolean;
  toggleBeginnerMind: () => void;
  isSparringMode: boolean;
  toggleSparringMode: () => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  documentTitle: '',
  nodes: [],
  activeNodeId: null,
  isBeginnerMind: false,
  isSparringMode: false,
  setTreeData: (title, nodes) => set({ documentTitle: title, nodes }),
  setActiveNode: (id) => set({ activeNodeId: id }),
  updateMastery: (nodeId, score) => set((state) => ({
    nodes: state.nodes.map((n) => 
      n.node_id === nodeId ? { ...n, mastery_score: Math.min(100, Math.max(0, score)) } : n
    )
  })),
  adjustMastery: (nodeId, delta) => set((state) => ({
    nodes: state.nodes.map((n) => 
      n.node_id === nodeId 
        ? { ...n, mastery_score: Math.min(100, Math.max(0, (n.mastery_score || 0) + delta)) } 
        : n
    )
  })),
  toggleBeginnerMind: () => set((state) => ({ isBeginnerMind: !state.isBeginnerMind })),
  toggleSparringMode: () => set((state) => ({ isSparringMode: !state.isSparringMode })),
}));
