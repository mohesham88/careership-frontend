import { create } from "zustand";
import type { ProjectDraft } from "../services/aiProjectDrafts";
import {
  listProjectDrafts,
  createProjectDraft,
  getProjectDraft,
  refineProjectDraft,
  finalizeProjectDraft,
  updateProjectDraft,
  deleteProjectDraft,
} from "../services/aiProjectDrafts";

export interface AIMessage {
  sender: "ai" | "user";
  text: string;
}

export interface AIChat {
  id: number;
  title: string;
  messages: AIMessage[];
}

interface DraftMetadata {
  name: string;
  categoryId: number;
  isPublic: boolean;
}

interface AIProjectState {
  drafts: ProjectDraft[];
  selectedDraftId: number | null;
  isLoading: boolean;
  error: string | null;
  chats: AIChat[];
  selectedChatId: number;
  selectChat: (id: number) => void;
  addChat: (title: string) => void;
  addMessage: (chatId: number, message: AIMessage) => void;
  pendingDraft: DraftMetadata | null;

  // Actions
  fetchDrafts: () => Promise<void>;
  selectDraft: (id: number | null) => void;
  setPendingDraft: (data: DraftMetadata | null) => void;
  initiateDraft: (prompt: string) => Promise<void>;
  refineDraft: (draftId: number, prompt: string) => Promise<void>;
  finalizeDraft: (draftId: number) => Promise<void>;
  updateDraft: (
    draftId: number,
    data: { name?: string; is_public?: boolean }
  ) => Promise<void>;
  deleteDraft: (draftId: number) => Promise<void>;
}

const initialChats: AIChat[] = [
  {
    id: 1,
    title: "E-commerce Website",
    messages: [
      {
        sender: "ai",
        text: "Hi! What kind of project would you like to create today?",
      },
      { sender: "user", text: "I want to build a blog platform." },
      {
        sender: "ai",
        text: "Great! What features do you want in your blog platform?",
      },
    ],
  },
  { id: 2, title: "Portfolio App", messages: [] },
  { id: 3, title: "Task Manager", messages: [] },
];

export const useAIProjectStore = create<AIProjectState>((set, get) => ({
  drafts: [],
  selectedDraftId: null,
  isLoading: false,
  error: null,
  chats: initialChats,
  selectedChatId: 1,
  selectChat: (id) => set({ selectedChatId: id }),
  addChat: (title) =>
    set((state) => {
      const newId =
        state.chats.length > 0
          ? Math.max(...state.chats.map((c) => c.id)) + 1
          : 1;
      return {
        chats: [...state.chats, { id: newId, title, messages: [] }],
        selectedChatId: newId,
      };
    }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),
  pendingDraft: null,

  fetchDrafts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await listProjectDrafts();
      set({ drafts: response.data });
    } catch (error) {
      set({ error: "Failed to fetch project drafts" });
      console.error("Error fetching drafts:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  selectDraft: (id) => set({ selectedDraftId: id }),

  setPendingDraft: (data) => set({ pendingDraft: data }),

  initiateDraft: async (prompt: string) => {
    const pendingDraft = get().pendingDraft;
    if (!pendingDraft) {
      set({ error: "No pending draft data" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await createProjectDraft({
        name: pendingDraft.name,
        prompt,
        category_id: pendingDraft.categoryId,
        is_public: pendingDraft.isPublic,
      });
      set((state) => ({
        drafts: [...state.drafts, response.data],
        selectedDraftId: response.data.id,
        pendingDraft: null, // Clear pending draft after successful creation
      }));
    } catch (error) {
      set({ error: "Failed to create project draft" });
      console.error("Error creating draft:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  refineDraft: async (draftId, prompt) => {
    set({ isLoading: true, error: null });
    try {
      const response = await refineProjectDraft(draftId, { prompt });
      set((state) => ({
        drafts: state.drafts.map((draft) =>
          draft.id === draftId ? response.data : draft
        ),
      }));
    } catch (error) {
      set({ error: "Failed to refine project draft" });
      console.error("Error refining draft:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  finalizeDraft: async (draftId) => {
    set({ isLoading: true, error: null });
    try {
      await finalizeProjectDraft(draftId);
      // After finalizing, remove the draft from the list
      set((state) => ({
        drafts: state.drafts.filter((draft) => draft.id !== draftId),
        selectedDraftId: null,
      }));
    } catch (error) {
      set({ error: "Failed to finalize project draft" });
      console.error("Error finalizing draft:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateDraft: async (draftId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateProjectDraft(draftId, data);
      set((state) => ({
        drafts: state.drafts.map((draft) =>
          draft.id === draftId ? response.data : draft
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update project draft" });
      console.error("Error updating draft:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDraft: async (draftId) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProjectDraft(draftId);
      set((state) => ({
        drafts: state.drafts.filter((draft) => draft.id !== draftId),
        selectedDraftId:
          state.selectedDraftId === draftId ? null : state.selectedDraftId,
      }));
    } catch (error) {
      set({ error: "Failed to delete project draft" });
      console.error("Error deleting draft:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
