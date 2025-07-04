import api from "./api";

export interface ProjectDraft {
  id: number;
  name: string | null;
  status: "generating" | "pending_review" | "completed" | "archived";
  is_public: boolean;
  category: string;
  difficulty_level: string;
  created_at: string;
  latest_project_json?: Record<string, any>;
  conversation_history?: {
    role: "user" | "model";
    parts: string[];
  }[];
}

export interface CreateProjectDraftRequest {
  name: string;
  prompt: string;
  category_id: number;
  difficulty_level_id?: number;
  is_public: boolean;
}

export interface RefineProjectDraftRequest {
  prompt: string;
}

const BASE_URL = "/projects/drafts/";

// List all project drafts
export const listProjectDrafts = (filters?: {
  name?: string;
  category?: number;
  difficulty_level?: number;
  is_public?: boolean;
}) => {
  return api.get<ProjectDraft[]>(BASE_URL, { params: filters });
};

// Create a new project draft
export const createProjectDraft = (data: CreateProjectDraftRequest) => {
  return api.post<ProjectDraft>(BASE_URL, data);
};

// Get a specific project draft
export const getProjectDraft = (draftId: number) => {
  return api.get<ProjectDraft>(`${BASE_URL}/${draftId}`);
};

// Refine an existing project draft
export const refineProjectDraft = (
  draftId: number,
  data: RefineProjectDraftRequest
) => {
  return api.post<ProjectDraft>(`${BASE_URL}/${draftId}/refine/`, data);
};

// Finalize a project draft
export const finalizeProjectDraft = (draftId: number, isPublic?: boolean) => {
  return api.post<{ id: number; name: string; slug: string; message: string }>(
    `${BASE_URL}/${draftId}/generate`,
    isPublic !== undefined ? { is_public: isPublic } : undefined
  );
};

// Update project draft details
export const updateProjectDraft = (
  draftId: number,
  data: Partial<{ name: string; is_public: boolean }>
) => {
  return api.patch<ProjectDraft>(`${BASE_URL}/${draftId}`, data);
};

// Delete a project draft
export const deleteProjectDraft = (draftId: number) => {
  return api.delete(`${BASE_URL}/${draftId}`);
};
