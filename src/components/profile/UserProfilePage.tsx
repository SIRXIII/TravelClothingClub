import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit3, Settings, Users, Activity, Shield, MapPin, Calendar, Badge } from 'lucide-react';
import { UserProfile } from '../../types/userProfile';
import { useAuth } from '../../hooks/useAuth';
import AvatarBuilder from '../avatar/AvatarBuilder';
import StyleProfileSection from './StyleProfileSection';
import ActivityFeed from './ActivityFeed';
import ConnectionsList from './ConnectionsList';
import ProfileSettings from './ProfileSettings';

function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    // Load user profile data
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      // This would be replaced with actual API call
      const mockProfile: UserProfile = {
        id: '1',
        user_id: userId || '1',
        display_name: 'Alex Johnson',
        username: 'alexj_travels',
        avatar_config: JSON.stringify({
          id: '1',
          style: 'stylized3d',
          appearance: {
            skinTone: '#F4C2A1',
            hair: { style: 'short-casual', color: '#8B4513', texture: 'straight' }
          }
        }),
        bio: 'Travel enthusiast and fashion lover. Always looking for the perfect outfit for my next adventure! ✈️👗',
        location: 'New York, NY',
        pronouns: 'She/Her',
        date_joined: '2024-01-15',
        last_active: new Date().toISOString(),
        email: 'alex@example.com',
        style_profile: {
          stats: {
            height: "5'6\"",
            weight: '140lbs'
          },
          sizes: {
            shirt: 'M',
            shirt_fit: 'Just right',
            waist: '28',
            waist_fit: 'Just right',
            inseam: '30',
            blazer: '38',
            shoe: '8',
            shoe_width: 'Medium',
            tall_sizes: false
          },
          fit_considerations: {
            casual_shirts: 'Just right',
            button_up_shirts: 'Slightly loose',
            jeans_fit: 'Skinny',
            pants_fit: 'Straight',
            shorts_length: 'Mid-thigh',
            shirt_collar: 'Just right',
            sleeve_length: 'Just right',
            shirt_shoulder: 'Just right',
            pant_thigh: 'Just right',
            pant_length: 'Just right',
            body_type: 'Pear'
          },
          category_preferences: {
            casual: true,
            business_casual: true,
            night_out: true,
            active: false,
            formal: true
          },
          color_preferences: {
            preferred_colors: ['Navy', 'Blush', 'Emerald', 'Black'],
            colors_to_avoid: ['Neon Yellow', 'Orange']
          },
          fabric_preferences: {
            preferred_fabrics: ['Cotton', 'Silk', 'Wool'],
            fabrics_to_avoid: ['Polyester', 'Acrylic']
          },
          occasion_preferences: ['Work', 'Date Night', 'Travel', 'Brunch']
        },
        privacy_settings: {
          display_name: 'public',
          bio: 'public',
          location: 'public',
          pronouns: 'public',
          email: 'private',
          phone: 'private',
          social_links: 'public',
          style_profile: 'connections',
          activity_feed: 'public'
        },
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'America/New_York',
          notifications: {
            email_marketing: true,
            email_updates: true,
            push_notifications: true,
            rental_reminders: true,
            new_collections: true
          }
        },
        follower_count: 234,
        following_count: 189,
        badges: ['Early Adopter', 'Style Guru', 'Frequent Traveler'],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: new Date().toISOString()
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSave = (avatarConfig: any) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_config: JSON.stringify(avatarConfig)
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'connections', label: 'Connections', icon: Users },
    ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold cursor-pointer hover:shadow-lg transition"
                onClick={() => isOwnProfile && setShowAvatarBuilder(true)}
              >
                {profile.display_name.charAt(0)}
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarBuilder(true)}
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.display_name}</h1>
                <span className="text-gray-500">@{profile.username}</span>
                {profile.pronouns && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {profile.pronouns}
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.date_joined).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{profile.following_count}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{profile.follower_count}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
              </div>

              {/* Badges */}
              {profile.badges.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <Badge className="w-4 h-4 text-gray-500" />
                  <div className="flex gap-2">
                    {profile.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isOwnProfile && (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Follow
                </button>
              )}
              {isOwnProfile && (
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <StyleProfileSection profile={profile} isOwner={isOwnProfile} />
            </div>
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rentals</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorites</span>
                    <span className="font-medium">47</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && <ActivityFeed userId={profile.user_id} />}
        {activeTab === 'connections' && <ConnectionsList userId={profile.user_id} />}
        {activeTab === 'settings' && isOwnProfile && <ProfileSettings profile={profile} />}
      </div>

      {/* Avatar Builder Modal */}
      <AvatarBuilder
        isOpen={showAvatarBuilder}
        onClose={() => setShowAvatarBuilder(false)}
        onSave={handleAvatarSave}
        initialConfig={profile.avatar_config ? JSON.parse(profile.avatar_config) : undefined}
      />
    </div>
  );
}

export default UserProfilePage;