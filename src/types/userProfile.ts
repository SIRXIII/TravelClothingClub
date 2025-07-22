export interface UserProfile {
  id: string;
  user_id: string;
  
  // Basic Information
  display_name: string;
  username: string;
  avatar_config: string; // JSON string of AvatarConfig
  bio?: string;
  location?: string;
  pronouns?: string;
  date_joined: string;
  last_active: string;
  
  // Contact Information
  email: string;
  phone?: string;
  social_links?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  
  // Style Profile & Measurements
  style_profile?: {
    stats: {
      height: string;
      weight: string;
    };
    sizes: {
      shirt: string;
      shirt_fit: string;
      waist: string;
      waist_fit: string;
      inseam: string;
      blazer: string;
      shoe: string;
      shoe_width?: string;
      tall_sizes: boolean;
    };
    fit_considerations: {
      casual_shirts: string;
      button_up_shirts: string;
      jeans_fit: string;
      pants_fit: string;
      shorts_length: string;
      shirt_collar: string;
      sleeve_length: string;
      shirt_shoulder: string;
      pant_thigh: string;
      pant_length: string;
      body_type: string;
    };
    category_preferences: {
      casual: boolean;
      business_casual: boolean;
      night_out: boolean;
      active: boolean;
      formal: boolean;
    };
    color_preferences: {
      preferred_colors: string[];
      colors_to_avoid: string[];
    };
    fabric_preferences: {
      preferred_fabrics: string[];
      fabrics_to_avoid: string[];
    };
    occasion_preferences: string[];
  };
  
  // Privacy Settings
  privacy_settings: {
    display_name: 'public' | 'connections' | 'private';
    bio: 'public' | 'connections' | 'private';
    location: 'public' | 'connections' | 'private';
    pronouns: 'public' | 'connections' | 'private';
    email: 'public' | 'connections' | 'private';
    phone: 'public' | 'connections' | 'private';
    social_links: 'public' | 'connections' | 'private';
    style_profile: 'public' | 'connections' | 'private';
    activity_feed: 'public' | 'connections' | 'private';
  };
  
  // Preferences
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email_marketing: boolean;
      email_updates: boolean;
      push_notifications: boolean;
      rental_reminders: boolean;
      new_collections: boolean;
    };
  };
  
  // Social Features
  follower_count: number;
  following_count: number;
  badges: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface UserConnection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'rental' | 'review' | 'favorite' | 'follow' | 'profile_update';
  activity_data: any;
  is_public: boolean;
  created_at: string;
}