// Database types for Supabase
// These will be generated from your Supabase schema
// For now, we'll define them manually

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          title: string;
          description: string;
          emoji: string;
          cover_image: string;
          tags: string[];
          published_date: string;
          blocks: any; // BlockNote JSON format
          is_published: boolean;
          created_at: string;
          updated_at: string;
          author_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          emoji: string;
          cover_image: string;
          tags: string[];
          published_date: string;
          blocks: any;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          author_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          emoji?: string;
          cover_image?: string;
          tags?: string[];
          published_date?: string;
          blocks?: any;
          is_published?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

