import React from 'react';
import { Sprout, BookOpen, Star } from 'lucide-react';

const tabs = [
  { id: 'products', label: 'Products', icon: Sprout },
  { id: 'about', label: 'About', icon: BookOpen },
  { id: 'reviews', label: 'Reviews', icon: Star }
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '1rem', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        gap: '1rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}
    >
      {tabs.map(tab => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 20px',
              background: isActive ? '#2d5f3f' : 'transparent',
              color: isActive ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <IconComponent size={16} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
