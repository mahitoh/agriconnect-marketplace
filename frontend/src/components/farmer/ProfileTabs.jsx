import React from 'react';
import { Sprout, BookOpen, Star } from 'lucide-react';

const tabs = [
  { id: 'products', label: 'Products', icon: Sprout },
  { id: 'about', label: 'About', icon: BookOpen },
  { id: 'reviews', label: 'Reviews', icon: Star }
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 lg:p-4 mb-4 sm:mb-6 shadow-sm border border-[var(--border-light)] overflow-x-auto">
      <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[44px] touch-manipulation whitespace-nowrap shrink-0 ${
                isActive 
                  ? 'bg-[var(--primary-500)] text-white' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)]'
              }`}
            >
              <IconComponent size={16} className="shrink-0" /> {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTabs;
