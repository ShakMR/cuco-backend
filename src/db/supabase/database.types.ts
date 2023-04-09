export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Currency: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          symbol: string | null;
          uuid: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          symbol?: string | null;
          uuid: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          symbol?: string | null;
          uuid?: string;
        };
      };
      Participation: {
        Row: {
          created_at: string | null;
          id: number;
          project_id: number | null;
          share: number;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          project_id?: number | null;
          share: number;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          project_id?: number | null;
          share?: number;
          user_id?: number | null;
        };
      };
      Passport: {
        Row: {
          created_at: string | null;
          id: number;
          password: string;
          salt: string;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          password: string;
          salt: string;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          password?: string;
          salt?: string;
          user_id?: number | null;
        };
      };
      PaymentType: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
        };
      };
      Project: {
        Row: {
          created_at: string | null;
          id: number;
          isOpen: boolean | null;
          name: string | null;
          uuid: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          isOpen?: boolean | null;
          name?: string | null;
          uuid: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          isOpen?: boolean | null;
          name?: string | null;
          uuid?: string;
        };
      };
      Spending: {
        Row: {
          amount: number;
          concept: string;
          created_at: string | null;
          currency: number;
          date: string;
          id: number;
          payer_id: number;
          payment_type: number | null;
          uuid: string;
        };
        Insert: {
          amount: number;
          concept: string;
          created_at?: string | null;
          currency: number;
          date?: string;
          id?: number;
          payer_id: number;
          payment_type?: number | null;
          uuid: string;
        };
        Update: {
          amount?: number;
          concept?: string;
          created_at?: string | null;
          currency?: number;
          date?: string;
          id?: number;
          payer_id?: number;
          payment_type?: number | null;
          uuid?: string;
        };
      };
      Statics: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
          value: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
          value?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
          value?: number | null;
        };
      };
      User: {
        Row: {
          created_at: string | null;
          email: string | null;
          external_id: string | null;
          id: number;
          is_ghost: boolean;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: number;
          is_ghost?: boolean;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: number;
          is_ghost?: boolean;
          name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
