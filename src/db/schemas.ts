import { Database } from './supabase/database.types';

export type Project = Database['public']['Tables']['Project']['Row'];
