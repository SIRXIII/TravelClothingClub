import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit3, Lock } from 'lucide-react';
import { UserProfile } from '../../types/userProfile';

interface StyleProfileSectionProps {
  profile: UserProfile;
  isOwner: boolean;
}

function StyleProfileSection({ profile, isOwner }: StyleProfileSectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['stats']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const canViewSection = (sectionKey: keyof typeof profile.privacy_settings) => {
    const privacy = profile.privacy_settings[sectionKey];
    return privacy === 'public' || (isOwner && privacy !== 'private');
  };

  if (!profile.style_profile || !canViewSection('style_profile')) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Style Profile Private</h3>
          <p className="text-gray-600">This user's style profile is not publicly visible.</p>
        </div>
      </div>
    );
  }

  const { style_profile } = profile;

  const sections = [
    {
      id: 'stats',
      title: 'Stats',
      items: [
        { label: 'Height', value: style_profile.stats.height },
        { label: 'Weight', value: style_profile.stats.weight }
      ]
    },
    {
      id: 'sizes',
      title: 'Sizes',
      items: [
        { label: 'Shirt', value: style_profile.sizes.shirt },
        { label: 'Shirt fit', value: style_profile.sizes.shirt_fit },
        { label: 'Waist', value: style_profile.sizes.waist },
        { label: 'Waist fit', value: style_profile.sizes.waist_fit },
        { label: 'Inseam', value: style_profile.sizes.inseam },
        { label: 'Blazer', value: style_profile.sizes.blazer },
        { label: 'Shoe', value: style_profile.sizes.shoe },
        ...(style_profile.sizes.shoe_width ? [{ label: 'Shoe width', value: style_profile.sizes.shoe_width }] : []),
        { label: 'Tall sizes', value: style_profile.sizes.tall_sizes ? 'Yes' : 'No' }
      ]
    },
    {
      id: 'fit',
      title: 'Fit Considerations',
      items: [
        { label: 'Casual shirts', value: style_profile.fit_considerations.casual_shirts },
        { label: 'Button up shirts', value: style_profile.fit_considerations.button_up_shirts },
        { label: 'Jeans fit', value: style_profile.fit_considerations.jeans_fit },
        { label: 'Pants fit', value: style_profile.fit_considerations.pants_fit },
        { label: 'Shorts length', value: style_profile.fit_considerations.shorts_length },
        { label: 'Shirt collar', value: style_profile.fit_considerations.shirt_collar },
        { label: 'Sleeve length', value: style_profile.fit_considerations.sleeve_length },
        { label: 'Shirt shoulder', value: style_profile.fit_considerations.shirt_shoulder },
        { label: 'Pant thigh', value: style_profile.fit_considerations.pant_thigh },
        { label: 'Pant length', value: style_profile.fit_considerations.pant_length },
        { label: 'Body type', value: style_profile.fit_considerations.body_type }
      ]
    },
    {
      id: 'preferences',
      title: 'Category Preferences',
      items: Object.entries(style_profile.category_preferences)
        .filter(([_, enabled]) => enabled)
        .map(([category, _]) => ({
          label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: '✓'
        }))
    },
    {
      id: 'colors',
      title: 'Color Preferences',
      items: [
        ...(style_profile.color_preferences.preferred_colors.length > 0 ? [{
          label: 'Preferred Colors',
          value: style_profile.color_preferences.preferred_colors.join(', ')
        }] : []),
        ...(style_profile.color_preferences.colors_to_avoid.length > 0 ? [{
          label: 'Colors to Avoid',
          value: style_profile.color_preferences.colors_to_avoid.join(', ')
        }] : [])
      ]
    },
    {
      id: 'fabrics',
      title: 'Fabric Preferences',
      items: [
        ...(style_profile.fabric_preferences.preferred_fabrics.length > 0 ? [{
          label: 'Preferred Fabrics',
          value: style_profile.fabric_preferences.preferred_fabrics.join(', ')
        }] : []),
        ...(style_profile.fabric_preferences.fabrics_to_avoid.length > 0 ? [{
          label: 'Fabrics to Avoid',
          value: style_profile.fabric_preferences.fabrics_to_avoid.join(', ')
        }] : [])
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Style Profile</h2>
          {isOwner && (
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.id} className="p-6">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes(section.id) && (
              <div className="mt-4 space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StyleProfileSection;