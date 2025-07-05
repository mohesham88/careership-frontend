import { create } from "zustand";
import type {
  ProjectDraft,
  CreateProjectDraftRequest,
} from "../services/aiProjectDrafts";
import {
  listProjectDrafts,
  createProjectDraft,
  getProjectDraft,
  refineProjectDraft,
  finalizeProjectDraft,
  updateProjectDraft,
  deleteProjectDraft,
} from "../services/aiProjectDrafts";

interface AIProjectState {
  drafts: ProjectDraft[];
  selectedDraftId: number | null;
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  isFetchingDraftDetails: boolean;

  // Actions
  fetchDrafts: () => Promise<void>;
  selectDraft: (id: number | null) => Promise<void>;
  fetchDraftDetails: (draftId: number) => Promise<void>;
  createDraft: (payload: CreateProjectDraftRequest) => Promise<void>;
  refineDraft: (draftId: number, prompt: string) => Promise<void>;
  startPollingDraft: (draftId: number) => void;
  stopPollingDraft: () => void;
  finalizeDraft: (draftId: number) => Promise<void>;
  updateDraft: (
    draftId: number,
    data: { name?: string; is_public?: boolean }
  ) => Promise<void>;
  deleteDraft: (draftId: number) => Promise<void>;
}
export const useAIProjectStore = create<AIProjectState>((set, get) => {
  let pollingInterval: number | null = null;

  return {
    drafts: [],
    selectedDraftId: null,
    isLoading: false,
    error: null,
    isPolling: false,
    isFetchingDraftDetails: false,

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

    selectDraft: async (id) => {
      set({ selectedDraftId: id });
      if (id !== null) {
        await get().fetchDraftDetails(id);
      }
    },

    fetchDraftDetails: async (draftId) => {
      set({ isFetchingDraftDetails: true, error: null });
      try {
        const response = await getProjectDraft(draftId);
        const updatedDraft = response.data;

        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === draftId ? updatedDraft : draft
          ),
        }));
      } catch (error) {
        set({ error: "Failed to fetch draft details" });
        console.error("Error fetching draft details:", error);
      } finally {
        set({ isFetchingDraftDetails: false });
      }
    },

    createDraft: async (payload: CreateProjectDraftRequest) => {
      set({ isLoading: true, error: null });
      try {
        const response = await createProjectDraft(payload);
        set((state) => ({
          drafts: [...state.drafts, response.data],
          selectedDraftId: response.data.id,
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
        await refineProjectDraft(draftId, { prompt });
        // Update the draft status to 'generating' locally
        set((state) => ({
          drafts: state.drafts.map((draft) =>
            draft.id === draftId ? { ...draft, status: "generating" } : draft
          ),
        }));
        // Start polling for status updates
        get().startPollingDraft(draftId);
      } catch (error) {
        set({ error: "Failed to refine project draft" });
        console.error("Error refining draft:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    startPollingDraft: (draftId) => {
      const state = get();
      if (state.isPolling) {
        state.stopPollingDraft();
      }

      set({ isPolling: true });

      const pollDraft = async () => {
        try {
          const response = await getProjectDraft(draftId);
          const updatedDraft = response.data;

          set((state) => ({
            drafts: state.drafts.map((draft) =>
              draft.id === draftId ? updatedDraft : draft
            ),
          }));

          // Stop polling if status is no longer 'generating'
          if (updatedDraft.status !== "generating") {
            get().stopPollingDraft();

            if (updatedDraft.status === "archived") {
              set({
                error:
                  "AI generation failed. The draft has been archived. Please try refining again with different requirements.",
              });
            }
          }
        } catch (error) {
          console.error("Error polling draft:", error);
          // Continue polling even if there's an error, unless it's a permanent error
        }
      };

      // Poll immediately, then every 3 seconds
      pollDraft();
      pollingInterval = setInterval(pollDraft, 3000);
    },

    stopPollingDraft: () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
      set({ isPolling: false });
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
  };
});
