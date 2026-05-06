export type UserRole = "super_admin" | "owner" | "inventory_manager" | "staff";
export type ProductStatus = "active" | "draft" | "out_of_stock" | "archived";
export type DiscountType = "percentage" | "fixed";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type CustomerType = "retail" | "dealer" | "wholesaler";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          main_category_id: string | null;
          subcategory_id: string | null;
          tags: string[];
          base_price: number;
          discount_price: number | null;
          offer_status: boolean;
          status: ProductStatus;
          thumbnail_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          seo_slug: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string | null;
          color: string | null;
          fabric: string | null;
          custom_variant: string | null;
          sku_suffix: string | null;
          price_adjustment: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      inventory: {
        Row: {
          id: string;
          product_variant_id: string;
          stock_quantity: number;
          available_quantity: number;
          reserved_quantity: number;
          barcode: string | null;
          qr_code_url: string | null;
          low_stock_threshold: number;
          last_updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          mobile_number: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          customer_type: CustomerType;
          last_purchase_date: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customer_addresses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["customer_addresses"]["Insert"]>;
      };
      wishlists: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wishlists"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_id: string | null;
          rating: number;
          message: string | null;
          status: ReviewStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          expiry_date: string | null;
          usage_limit: number | null;
          used_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["coupons"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          product_id: string | null;
          customer_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["analytics_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Insert"]>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          description: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["activity_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action_type: string;
          table_name: string;
          record_id: string;
          old_value: Record<string, unknown> | null;
          new_value: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
      discount_type: DiscountType;
      review_status: ReviewStatus;
      customer_type: CustomerType;
    };
  };
}
