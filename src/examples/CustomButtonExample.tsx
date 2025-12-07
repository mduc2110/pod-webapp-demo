import { PodButton, usePodSDK } from '@pod/sdk';
import { useState } from 'react';

export default function CustomButtonExample() {
  const { postEvent } = usePodSDK();
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="example-card">
      <h2>Custom Buttons</h2>
      <p>
        The <code>PodButton</code> component can be customized with different event types
        and data. You can also use the SDK hooks to create your own custom buttons.
      </p>

      <div className="example-section">
        <h3>Pre-configured PodButtons</h3>
        <p>These buttons use the PodButton component with different configurations:</p>
        <div className="button-group">
          <PodButton eventType="web_app_close">
            Close WebView
          </PodButton>
          <PodButton eventType="web_app_expand">
            Expand WebView
          </PodButton>
          <PodButton
            eventType="user_interaction"
            eventData={{ type: 'button_click', button: 'primary' }}
          >
            Send Interaction Event
          </PodButton>
        </div>
      </div>

      <div className="example-section">
        <h3>Custom Styled PodButtons</h3>
        <p>PodButton accepts standard button props for styling:</p>
        <div className="button-group">
          <PodButton
            eventType="custom_action"
            eventData={{ style: 'primary' }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Gradient Button
          </PodButton>
          <PodButton
            eventType="custom_action"
            eventData={{ style: 'outline' }}
            style={{
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
            }}
          >
            Outline Button
          </PodButton>
        </div>
      </div>

      <div className="example-section">
        <h3>Custom Button with onClick Handler</h3>
        <p>
          You can combine PodButton's native event posting with your own onClick handler:
        </p>
        <div className="button-group">
          <PodButton
            eventType="custom_action"
            eventData={{ count: clickCount }}
            onClick={() => {
              setClickCount(prev => prev + 1);
              console.log(`Button clicked ${clickCount + 1} times`);
            }}
          >
            Clicked {clickCount} times
          </PodButton>
        </div>
      </div>

      <div className="example-section">
        <h3>Custom Button Using Hook</h3>
        <p>
          Create your own buttons using the <code>usePodSDK</code> or <code>usePodWebView</code> hooks:
        </p>
        <div className="button-group">
          <button
            className="demo-button"
            onClick={() => {
              postEvent('custom_action', {
                source: 'custom_button',
                timestamp: Date.now(),
              });
            }}
          >
            Custom Hook Button
          </button>
          <button
            className="demo-button secondary"
            onClick={() => {
              postEvent('analytics_event', {
                event: 'button_click',
                category: 'demo',
                label: 'custom_button',
              });
            }}
          >
            Analytics Event
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <div className="code-block">
{`import { PodButton, usePodSDK } from '@pod/sdk';

function CustomButtons() {
  const { postEvent } = usePodSDK();

  return (
    <div>
      {/* Basic PodButton */}
      <PodButton eventType="web_app_close">
        Close
      </PodButton>

      {/* Styled PodButton */}
      <PodButton
        eventType="custom_action"
        eventData={{ id: 123 }}
        style={{ background: 'blue', color: 'white' }}
      >
        Styled Button
      </PodButton>

      {/* PodButton with onClick */}
      <PodButton
        eventType="custom_action"
        onClick={() => console.log('Clicked!')}
      >
        With Handler
      </PodButton>

      {/* Custom button using hook */}
      <button onClick={() => postEvent('custom', { data: 'value' })}>
        Custom Button
      </button>
    </div>
  );
}`}
        </div>
      </div>
    </div>
  );
}

