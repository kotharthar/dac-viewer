import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './TabBar.css';

const TabBar = ({ tabs, activeTabId, onTabSwitch, onTabClose }) => {
  const getTabName = (tab) => {
    if (tab.filePath) {
      const parts = tab.filePath.split('/');
      return parts[parts.length - 1];
    }
    return 'Untitled';
  };

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => onTabSwitch(tab.id)}
        >
          <span className="tab-name" title={tab.filePath || 'Untitled'}>
            {getTabName(tab)}
            {tab.isDirty && <span className="tab-dirty">*</span>}
          </span>
          <button
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            title="Close tab"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TabBar;
