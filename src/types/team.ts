import type { User } from './user';

export interface Team {
  uuid: string;
  name: string;
  owner: User;
  members: User[];
  created_at: string;
}

export interface Invitation {
  uuid: string;
  team: string | Team;
  created_by: User;
  created_at: string;
  expires_in_days: number;
  is_active: boolean;
  invitation_url?: string;
} 