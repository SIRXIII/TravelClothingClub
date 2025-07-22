import React, { useState } from 'react';
import { Save, Shield, Bell, Palette, Globe, Download, Trash2 } from 'lucide-react';
import { UserProfile } from '../../types/userProfile';

interface ProfileSettingsProps {
  profile: UserProfile;
}

function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState(profile);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Save settings to backend
      console.log('Saving settings:', settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const sections = [
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Download }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
        <input
          type="text"
          value={settings.display_name}
          onChange={(e) => updateSetting('display_name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input
          type="text"
          value={settings.username}
          onChange={(e) => updateSetting('username', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={settings.bio || ''}
          onChange={(e) => updateSetting('bio', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Tell others about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={settings.location || ''}
          onChange={(e) => updateSetting('location', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="City, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
        <select
          value={settings.pronouns || ''}
          onChange={(e) => updateSetting('pronouns', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Select pronouns</option>
          <option value="She/Her">She/Her</option>
          <option value="He/Him">He/Him</option>
          <option value="They/Them">They/Them</option>
          <option value="Ask Me">Ask Me</option>
        </select>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Privacy Controls</h4>
        <p className="text-blue-800 text-sm">
          Control who can see different parts of your profile. Changes take effect immediately.
        </p>
      </div>

      {Object.entries(settings.privacy_settings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div>
            <h4 className="font-medium text-gray-900 capitalize">
              {key.replace('_', ' ')}
            </h4>
            <p className="text-sm text-gray-600">
              Who can see your {key.replace('_', ' ').toLowerCase()}
            </p>
          </div>
          <select
            value={value}
            onChange={(e) => updateSetting(`privacy_settings.${key}`, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="public">Everyone</option>
            <option value="connections">Connections Only</option>
            <option value="private">Only Me</option>
          </select>
        </div>
      ))}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Stay Updated</h4>
        <p className="text-yellow-800 text-sm">
          Choose how you'd like to be notified about activity on your account.
        </p>
      </div>

      {Object.entries(settings.preferences.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-gray-900 capitalize">
              {key.replace('_', ' ')}
            </h4>
            <p className="text-sm text-gray-600">
              Receive notifications about {key.replace('_', ' ').toLowerCase()}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSetting(`preferences.notifications.${key}`, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => updateSetting('preferences.theme', theme)}
              className={`p-4 rounded-lg border-2 transition capitalize ${
                settings.preferences.theme === theme
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <select
          value={settings.preferences.language}
          onChange={(e) => updateSetting('preferences.language', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          value={settings.preferences.timezone}
          onChange={(e) => updateSetting('preferences.timezone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">GMT</option>
          <option value="Europe/Paris">Central European Time</option>
        </select>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">Data Management</h4>
        <p className="text-red-800 text-sm">
          Manage your personal data and account settings. Some actions cannot be undone.
        </p>
      </div>

      <div className="space-y-4">
        <button className="flex items-center gap-3 w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-left">
          <Download className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900">Download Your Data</h4>
            <p className="text-sm text-blue-700">Get a copy of all your account data</p>
          </div>
        </button>

        <button className="flex items-center gap-3 w-full p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-left">
          <Trash2 className="w-5 h-5 text-red-600" />
          <div>
            <h4 className="font-medium text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700">Permanently delete your account and all data</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'data':
        return renderDataSettings();
      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Settings Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeSection} Settings
            </h2>
            {hasChanges && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
          </div>

          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;