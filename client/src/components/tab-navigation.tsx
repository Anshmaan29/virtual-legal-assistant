import { useState } from "react";

const tabs = [
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'handbook', label: 'Rule Handbook' },
  { id: 'tests', label: 'Practice Tests' },
  { id: 'scenarios', label: 'Traffic Scenarios' },
];

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('assistant');
  
  return (
    <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-shrink-0 px-5 py-3 border-b-2 font-medium focus:outline-none ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
