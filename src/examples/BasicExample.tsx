import { PodButton, usePodSDK } from '@pod/sdk';

export default function BasicExample() {
  const { isAvailable, postEvent } = usePodSDK();

  const handleCustomEvent = () => {
    postEvent('custom_action', {
      message: 'Hello from React!',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="example-card">
      <h2>Basic Usage</h2>
      <p>
        This example demonstrates the fundamental usage of PodSDK components and hooks.
        The SDK provides a bridge between your React web app and native iOS/Android containers.
      </p>

      <div className="example-section">
        <h3>Bridge Status</h3>
        <div className="info-box">
          <p>
            <strong>Bridge Available:</strong>{' '}
            <span className={isAvailable ? 'status-available' : 'status-unavailable'}>
              {isAvailable ? '✅ Yes' : '❌ No (Running in browser)'}
            </span>
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            When running inside a native WebView container with PodSDK bridge.js loaded,
            the bridge will be available. In a regular browser, it will show as unavailable.
          </p>
        </div>
      </div>

      <div className="example-section">
        <h3>PodButton Component</h3>
        <p>
          The <code>PodButton</code> component is a pre-configured button that automatically
          posts events to the native container when clicked.
        </p>
        <div className="button-group">
          <PodButton eventType="web_app_close">
            Close WebView
          </PodButton>
          <PodButton
            eventType="custom_action"
            eventData={{ action: 'button_clicked', source: 'basic_example' }}
          >
            Send Custom Event
          </PodButton>
        </div>
      </div>

      <div className="example-section">
        <h3>Using usePodSDK Hook</h3>
        <p>
          The <code>usePodSDK</code> hook provides direct access to the SDK's functionality,
          allowing you to post custom events programmatically.
        </p>
        <div className="button-group">
          <button className="demo-button" onClick={handleCustomEvent}>
            Post Custom Event via Hook
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <div className="code-block">
{`import { PodSDKProvider, PodButton, usePodSDK } from '@pod/sdk';

function App() {
  return (
    <PodSDKProvider>
      <MyComponent />
    </PodSDKProvider>
  );
}

function MyComponent() {
  const { postEvent, isAvailable } = usePodSDK();

  const handleClick = () => {
    postEvent('custom_action', { data: 'value' });
  };

  return (
    <div>
      <p>Bridge: {isAvailable ? 'Available' : 'Not Available'}</p>
      <PodButton eventType="web_app_close">
        Close
      </PodButton>
      <button onClick={handleClick}>
        Custom Action
      </button>
    </div>
  );
}`}
        </div>
      </div>
    </div>
  );
}

