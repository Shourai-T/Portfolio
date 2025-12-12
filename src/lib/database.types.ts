export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string
          image_url: string
          demo_url: string | null
          github_url: string | null
          tags: string[]
          featured: boolean
          published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content: string
          image_url: string
          demo_url?: string | null
          github_url?: string | null
          tags: string[]
          featured?: boolean
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string
          image_url?: string
          demo_url?: string | null
          github_url?: string | null
          tags?: string[]
          featured?: boolean
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image: string | null
          tags: string[]
          published: boolean
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          cover_image?: string | null
          tags: string[]
          published?: boolean
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          cover_image?: string | null
          tags?: string[]
          published?: boolean
          views?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category: string
          tags: string[]
          featured: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          category: string
          tags: string[]
          featured?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          category?: string
          tags?: string[]
          featured?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          type: 'project' | 'blog' | 'photo'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'project' | 'blog' | 'photo'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'project' | 'blog' | 'photo'
          created_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          project_id: string
          name: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          id: string
          full_name: string
          role: string
          short_bio: string | null
          about_content: string | null
          social_links: Json | null
          resume_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          role: string
          short_bio?: string | null
          about_content?: string | null
          social_links?: Json | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: string
          short_bio?: string | null
          about_content?: string | null
          social_links?: Json | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      educations: {
        Row: {
          id: string
          school: string
          major: string | null
          degree: string | null
          start_date: string | null
          end_date: string | null
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          school: string
          major?: string | null
          degree?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          school?: string
          major?: string | null
          degree?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          id: string
          company: string
          position: string
          start_date: string | null
          end_date: string | null
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      technical_skills: {
        Row: {
          id: string
          name: string
          category: string
          proficiency: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          proficiency?: number
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          proficiency?: number
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

