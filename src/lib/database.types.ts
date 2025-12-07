export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          image_url: string;
          demo_url: string | null;
          github_url: string | null;
          tags: string[];
          featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          tags: string[];
          published: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      photos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          thumbnail_url: string | null;
          category: string;
          tags: string[];
          featured: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
    };
  };
}
