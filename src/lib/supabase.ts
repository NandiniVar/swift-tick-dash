import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator?: Profile;
};

export type TicketStatus = 'todo' | 'in_progress' | 'done';

export type Ticket = {
  id: string;
  title: string;
  description: string | null;
  status: TicketStatus;
  project_id: string;
  creator_id: string;
  updater_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  creator?: Profile;
  updater?: Profile;
};

export type Notification = {
  id: string;
  user_id: string;
  message: string;
  ticket_id: string | null;
  project_id: string | null;
  read: boolean;
  created_at: string;
};
