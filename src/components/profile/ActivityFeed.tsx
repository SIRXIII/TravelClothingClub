import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag, Star, UserPlus } from 'lucide-react';
import { UserActivity } from '../../types/userProfile';

interface ActivityFeedProps {
  userId: string;
}

function ActivityFeed({ userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    try {
      // Mock activity data
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          user_id: userId,
          activity_type: 'rental',
          activity_data: {
            item_name: 'Navy Blue Business Suit',
            item_image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=200',
            rental_dates: '2024-01-15 to 2024-01-18'
          },
          is_public: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          user_id: userId,
          activity_type: 'review',
          activity_data: {
            item_name: 'Red Cocktail Dress',
            rating: 5,
            review_text: 'Perfect fit and beautiful color! Got so many compliments.',
            item_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200'
          },
          is_public: true,
          created_at: '2024-01-12T14:30:00Z'
        },
        {
          id: '3',
          user_id: userId,
          activity_type: 'favorite',
          activity_data: {
            item_name: 'Gray Travel Blazer',
            item_image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=200'
          },
          is_public: true,
          created_at: '2024-01-10T09:15:00Z'
        },
        {
          id: '4',
          user_id: userId,
          activity_type: 'follow',
          activity_data: {
            followed_user: 'Sarah Chen',
            followed_username: 'sarahc_style'
          },
          is_public: true,
          created_at: '2024-01-08T16:45:00Z'
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rental':
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatActivityText = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'rental':
        return `rented ${activity.activity_data.item_name}`;
      case 'review':
        return `reviewed ${activity.activity_data.item_name}`;
      case 'favorite':
        return `favorited ${activity.activity_data.item_name}`;
      case 'follow':
        return `started following ${activity.activity_data.followed_user}`;
      default:
        return 'had some activity';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
          <p className="text-gray-600">Start renting, reviewing, and connecting to see your activity here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.activity_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-900">
                      <span className="font-medium">You</span> {formatActivityText(activity)}
                    </p>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{formatDate(activity.created_at)}</span>
                  </div>

                  {/* Activity-specific content */}
                  {activity.activity_type === 'rental' && (
                    <div className="flex items-center gap-3 mt-3">
                      <img
                        src={activity.activity_data.item_image}
                        alt={activity.activity_data.item_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{activity.activity_data.item_name}</p>
                        <p className="text-sm text-gray-600">{activity.activity_data.rental_dates}</p>
                      </div>
                    </div>
                  )}

                  {activity.activity_type === 'review' && (
                    <div className="mt-3">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={activity.activity_data.item_image}
                          alt={activity.activity_data.item_name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < activity.activity_data.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">
                        "{activity.activity_data.review_text}"
                      </p>
                    </div>
                  )}

                  {activity.activity_type === 'favorite' && (
                    <div className="flex items-center gap-3 mt-3">
                      <img
                        src={activity.activity_data.item_image}
                        alt={activity.activity_data.item_name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <p className="font-medium text-gray-900">{activity.activity_data.item_name}</p>
                    </div>
                  )}

                  {activity.activity_type === 'follow' && (
                    <div className="mt-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                          {activity.activity_data.followed_user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.activity_data.followed_user}</p>
                          <p className="text-sm text-gray-600">@{activity.activity_data.followed_username}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;