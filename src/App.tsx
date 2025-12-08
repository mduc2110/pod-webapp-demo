import { useState } from 'react';
import { PodSDKProvider, usePodEvent } from '@pod/sdk';
import './App.css';
import BasicExample from './examples/BasicExample';
import EventExample from './examples/EventExample';
import WebViewExample from './examples/WebViewExample';
import CustomButtonExample from './examples/CustomButtonExample';
import AdvancedExample from './examples/AdvancedExample';

function App() {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Usage', component: BasicExample },
    { id: 'events', label: 'Events', component: EventExample },
    { id: 'webview', label: 'WebView', component: WebViewExample },
    { id: 'buttons', label: 'Custom Buttons', component: CustomButtonExample },
    { id: 'advanced', label: 'Advanced', component: AdvancedExample },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || BasicExample;

  return (
    <PodSDKProvider>
      <div className="app">
        <header className="app-header">
          <h1>🚀 PodSDK Demo</h1>
          <p>Comprehensive demonstration of @pod/sdk React library features</p>
        </header>

        <nav className="app-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="app-main">
          <ActiveComponent />
        </main>

        <footer className="app-footer">
          <p>
            This demo showcases the PodSDK React library for embedding native iOS/Android WebView containers.
          </p>
          <p className="bridge-status">
            <BridgeStatus />
          </p>
        </footer>
      </div>
    </PodSDKProvider>
  );
}

function BridgeStatus() {
  const { isAvailable } = usePodEvent();
  return (
    <span className={isAvailable ? 'status-available' : 'status-unavailable'}>
      Bridge: {isAvailable ? '✅ Available' : '❌ Not Available (Running in browser)'}
    </span>
  );
}

export default App;

