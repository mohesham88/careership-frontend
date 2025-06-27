import type { User } from './user';

export interface Team {
  id: number;
  name: string;
  owner: User;
  members: User[];
  created_at: string;
}

export interface Invitation {
  uuid: string;
  team: number | Team;
  created_by: User;
  created_at: string;
  expires_in_days: number;
  is_active: boolean;
} 