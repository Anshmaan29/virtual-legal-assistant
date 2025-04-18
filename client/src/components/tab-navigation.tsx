import { useState } from "react";
import { useLocation } from "wouter";

const tabs = [
  { 
    id: 'assistant', 
    label: 'AI Assistant',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    path: '/'
  },
  { 
    id: 'handbook', 
    label: 'Rule Handbook',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    path: '/handbook'
  },
  { 
    id: 'tests', 
    label: 'Practice Tests',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    path: '/tests'
  },
  { 
    id: 'scenarios', 
    label: 'Traffic Scenarios',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: '/scenarios'
  },
];

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [_, setLocation] = useLocation();
  
  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    setLocation(tab.path);
  };
  
  return (
    <div className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-shrink-0 px-5 py-4 border-b-3 font-medium focus:outline-none flex items-center space-x-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-b-3 border-blue-600 text-blue-600'
                  : 'border-transparent text-neutral-500 hover:text-blue-500 hover:border-blue-300'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <span className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}>{tab.icon}</span>
              <span>{tab.label}</span>
              
              {/* Animated dot indicator for active tab */}
              {activeTab === tab.id && (
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
