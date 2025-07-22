import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserMinus, Users } from 'lucide-react';

interface Connection {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  bio?: string;
  follower_count: number;
  is_following: boolean;
  avatar_color: string;
}

interface ConnectionsListProps {
  userId: string;
}

function ConnectionsList({ userId }: ConnectionsListProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, [userId, activeTab]);

  const loadConnections = async () => {
    try {
      // Mock connections data
      const mockConnections: Connection[] = [
        {
          id: '1',
          user_id: '1',
          display_name: 'Sarah Chen',
          username: 'sarahc_style',
          bio: 'Fashion blogger & travel enthusiast 🌍✨',
          follower_count: 1234,
          is_following: true,
          avatar_color: '#FF6B6B'
        },
        {
          id: '2',
          user_id: '2',
          display_name: 'Mike Rodriguez',
          username: 'mike_travels',
          bio: 'Business traveler | Minimalist wardrobe advocate',
          follower_count: 567,
          is_following: false,
          avatar_color: '#4ECDC4'
        },
        {
          id: '3',
          user_id: '3',
          display_name: 'Emma Thompson',
          username: 'emma_chic',
          bio: 'Sustainable fashion lover 🌱',
          follower_count: 890,
          is_following: true,
          avatar_color: '#45B7D1'
        },
        {
          id: '4',
          user_id: '4',
          display_name: 'David Kim',
          username: 'david_k',
          bio: 'Tech professional | Weekend adventurer',
          follower_count: 234,
          is_following: false,
          avatar_color: '#96CEB4'
        },
        {
          id: '5',
          user_id: '5',
          display_name: 'Lisa Wang',
          username: 'lisa_wanderlust',
          bio: 'Digital nomad sharing style tips from around the world',
          follower_count: 2156,
          is_following: true,
          avatar_color: '#FFEAA7'
        }
      ];

      setConnections(mockConnections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = (connectionId: string) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === connectionId
          ? { ...conn, is_following: !conn.is_following }
          : conn
      )
    );
  };

  const filteredConnections = connections.filter(conn =>
    conn.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Connections</h2>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'following'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'followers'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Followers
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Connections List */}
      {filteredConnections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No connections found' : `No ${activeTab} yet`}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : `Start connecting with other travelers to see them here!`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConnections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg"
                  style={{ backgroundColor: connection.avatar_color }}
                >
                  {connection.display_name.charAt(0)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {connection.display_name}
                    </h3>
                    <span className="text-gray-500">@{connection.username}</span>
                  </div>
                  
                  {connection.bio && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      {connection.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{connection.follower_count.toLocaleString()} followers</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleFollow(connection.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    connection.is_following
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {connection.is_following ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConnectionsList;