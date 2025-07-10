import React from 'react';
import { Calendar, Package, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

interface UserDashboardProps {
  onSignOut: () => void;
}

function UserDashboard({ onSignOut }: UserDashboardProps) {
  const { user, signOut } = useAuth();
  const { subscription, orders, loading, getCurrentPlan, hasActiveSubscription } = useStripe();

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  const currentPlan = getCurrentPlan();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">My Account</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Subscription Status</h2>
          </div>
          
          {hasActiveSubscription() && currentPlan ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">{currentPlan.name} Plan</h3>
                  <p className="text-green-700">{currentPlan.description}</p>
                  <p className="text-sm text-green-600 mt-1">
                    ${currentPlan.price}/month • Active
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">
                    {currentPlan.currentPeriodEnd && (
                      <>Next billing: {new Date(currentPlan.currentPeriodEnd * 1000).toLocaleDateString()}</>
                    )}
                  </p>
                  {currentPlan.cancelAtPeriodEnd && (
                    <p className="text-sm text-orange-600 mt-1">Cancels at period end</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800">No Active Subscription</h3>
              <p className="text-gray-600">Subscribe to start receiving curated travel outfits</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold">Plan Your Trip</h3>
            </div>
            <p className="text-gray-600 text-sm">Schedule your next clothing delivery</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Browse Collection</h3>
            </div>
            <p className="text-gray-600 text-sm">Explore available outfits and styles</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold">Style Preferences</h3>
            </div>
            <p className="text-gray-600 text-sm">Update your style profile and sizes</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.order_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(order.amount_total / 100).toFixed(2)} {order.currency.toUpperCase()}
                      </p>
                      <p className={`text-sm capitalize ${
                        order.order_status === 'completed' ? 'text-green-600' : 
                        order.order_status === 'pending' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {order.order_status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No orders yet</p>
              <p className="text-sm text-gray-500">Your order history will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;