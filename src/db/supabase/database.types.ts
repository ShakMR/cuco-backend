export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: 'Participation_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'Project';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Participation_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'Passport_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [];
      };
      Project: {
        Row: {
          created_at: string | null;
          id: number;
          isOpen: boolean | null;
          name: string | null;
          short_name: string;
          uuid: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          isOpen?: boolean | null;
          name?: string | null;
          short_name?: string;
          uuid: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          isOpen?: boolean | null;
          name?: string | null;
          short_name?: string;
          uuid?: string;
        };
        Relationships: [];
      };
      Spending: {
        Row: {
          active: boolean;
          amount: number;
          concept: string;
          created_at: string | null;
          currency: number;
          date: string;
          id: number;
          payer_id: number;
          payment_type: number | null;
          project_id: number | null;
          uuid: string;
        };
        Insert: {
          active?: boolean;
          amount: number;
          concept: string;
          created_at?: string | null;
          currency: number;
          date?: string;
          id?: number;
          payer_id: number;
          payment_type?: number | null;
          project_id?: number | null;
          uuid: string;
        };
        Update: {
          active?: boolean;
          amount?: number;
          concept?: string;
          created_at?: string | null;
          currency?: number;
          date?: string;
          id?: number;
          payer_id?: number;
          payment_type?: number | null;
          project_id?: number | null;
          uuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Spending_currency_fkey';
            columns: ['currency'];
            isOneToOne: false;
            referencedRelation: 'Currency';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Spending_payer_id_fkey';
            columns: ['payer_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Spending_payment_type_fkey';
            columns: ['payment_type'];
            isOneToOne: false;
            referencedRelation: 'PaymentType';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Spending_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'Project';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [];
      };
      User: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          email: string | null;
          external_id: string | null;
          id: number;
          is_ghost: boolean;
          name: string | null;
          uuid: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: number;
          is_ghost?: boolean;
          name?: string | null;
          uuid: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          external_id?: string | null;
          id?: number;
          is_ghost?: boolean;
          name?: string | null;
          uuid?: string;
        };
        Relationships: [];
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
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
