export interface Task {
    id: number;
    name: string;
    slug: string;
    difficulty_level: string;
    created_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    slug: string;
    is_premium: boolean;
    created_at: string;
    max_team_size: number;
    difficulty_level: string;
    category: string;
    tasks: Task[];
}

export interface ProjectsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Project[];
} 