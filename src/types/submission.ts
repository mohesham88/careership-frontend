export interface Submission {
  id: number;
  project: number;
  task: number;
  user: number;
  team: number;
  status: string;
  passed_tests: number;
  failed_test_index: number | null;
  passed_percentage: number;
  execution_logs?: any;
  feedback?: any;
  deployment_url?: string;
  github_url?: string;
  completed_at?: string | null;
  created_at: string;
} 