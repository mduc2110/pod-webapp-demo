import { useEffect, useState } from 'react';
import { usePodSDK, usePodWebView, PodButton } from '@pod/sdk';

export default function AdvancedExample() {
  const { isAvailable, postEvent, onEvent } = usePodSDK();
  const { close, ready, expand } = usePodWebView({
    onClose: () => {
      console.log('WebView closed via callback');
      addMessage('WebView closed callback triggered', 'success');
    },
    onInitialized: () => {
      console.log('WebView initialized');
      addMessage('WebView initialized', 'success');
    },
    onError: (error) => {
      console.error('WebView error:', error);
      addMessage(`Error: ${error.message}`, 'error');
    },
  });

  const [messages, setMessages] = useState<Array<{ id: number; text: string; type: string }>>([]);

  useEffect(() => {
    if (!isAvailable) return;

    // Set up event listeners for common events
    const unsubscribers: Array<() => void> = [];

    // Listen to various event types
    const eventTypes = [
      'custom_event',
      'user_action',
      'web_app_close',
      'web_app_expand',
      'web_app_ready',
      'complex_event',
      'step_1',
      'step_2',
      'step_3',
      'callback_test',
    ];

    eventTypes.forEach(eventType => {
      const unsubscribe = onEvent(eventType, (eventData) => {
        addMessage(`Received event: ${eventType}`, 'success');
        if (eventData) {
          addMessage(`Data: ${JSON.stringify(eventData)}`, 'info');
        }
      });
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isAvailable, onEvent]);

  const addMessage = (text: string, type: string = 'info') => {
    setMessages(prev => [
      { id: Date.now(), text, type },
      ...prev,
    ]);
  };

  const handleComplexEvent = () => {
    const complexData = {
      user: {
        id: 12345,
        name: 'Demo User',
        email: 'demo@example.com',
      },
      action: 'complex_interaction',
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        platform: 'web',
      },
      nested: {
        level1: {
          level2: {
            value: 'deeply nested data',
          },
        },
      },
    };

    postEvent('complex_event', complexData, () => {
      addMessage('Complex event sent successfully', 'success');
    });
  };

  const handleSequentialEvents = () => {
    postEvent('step_1', { step: 1 }, () => {
      addMessage('Step 1 completed', 'success');
      postEvent('step_2', { step: 2 }, () => {
        addMessage('Step 2 completed', 'success');
        postEvent('step_3', { step: 3 }, () => {
          addMessage('Step 3 completed', 'success');
        });
      });
    });
  };

  return (
    <div className="example-card">
      <h2>Advanced Usage</h2>
      <p>
        This example demonstrates advanced features including complex event handling,
        sequential operations, and using all available hooks and methods.
      </p>

      <div className="example-section">
        <h3>WebView Control Methods</h3>
        <p>Use the <code>usePodWebView</code> hook to control the WebView programmatically:</p>
        <div className="button-group">
          <button className="demo-button" onClick={() => {
            ready();
            addMessage('WebView ready() called', 'info');
          }}>
            Call ready()
          </button>
          <button className="demo-button" onClick={() => {
            expand();
            addMessage('WebView expand() called', 'info');
          }}>
            Call expand()
          </button>
          <button className="demo-button secondary" onClick={() => {
            close();
            addMessage('WebView close() called', 'info');
          }}>
            Call close()
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Complex Event Data</h3>
        <p>Send complex nested data structures:</p>
        <div className="button-group">
          <button className="demo-button" onClick={handleComplexEvent}>
            Send Complex Event
          </button>
          <button className="demo-button" onClick={handleSequentialEvents}>
            Send Sequential Events
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Event Callbacks</h3>
        <p>
          The <code>postEvent</code> method accepts an optional callback that executes
          after the event is successfully posted:
        </p>
        <div className="button-group">
          <button
            className="demo-button"
            onClick={() => {
              postEvent('callback_test', { test: true }, () => {
                addMessage('Event callback executed!', 'success');
              });
            }}
          >
            Test Event Callback
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Multiple Event Listeners</h3>
        <p>
          Listen to multiple event types simultaneously:
        </p>
        <div className="info-box">
          <p>
            This example listens to multiple event types. Check the message log below to see
            events as they're received. You can subscribe to specific event types or set up
            listeners for all events you expect to receive.
          </p>
        </div>
      </div>

      <div className="example-section">
        <h3>Message Log</h3>
        <div className="event-log" style={{ maxHeight: '250px' }}>
          {messages.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
              No messages yet. Interact with the buttons above to see messages.
            </p>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`event-log-item ${msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{msg.text}</span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(msg.id).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          className="demo-button secondary"
          onClick={() => setMessages([])}
          style={{ marginTop: '1rem' }}
        >
          Clear Messages
        </button>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <div className="code-block">
{`import { usePodSDK, usePodWebView } from '@pod/sdk';

function AdvancedExample() {
  const { postEvent, onEvent } = usePodSDK();
  const { close, ready, expand } = usePodWebView({
    onClose: () => console.log('Closed'),
    onInitialized: () => console.log('Initialized'),
  });

  useEffect(() => {
    // Listen to all events
    const unsubscribe = onEvent('*', (data, type) => {
      console.log('Event:', type, data);
    });

    return () => unsubscribe();
  }, [onEvent]);

  const handleComplex = () => {
    postEvent('complex', {
      nested: { data: 'value' }
    }, () => {
      console.log('Event sent!');
    });
  };

  return (
    <div>
      <button onClick={ready}>Ready</button>
      <button onClick={expand}>Expand</button>
      <button onClick={close}>Close</button>
      <button onClick={handleComplex}>Send Complex</button>
    </div>
  );
}`}
        </div>
      </div>

      {!isAvailable && (
        <div className="info-box warning">
          <p>
            <strong>Note:</strong> Some features require the native bridge to be available.
            In a browser environment, these will be logged but not actually executed.
          </p>
        </div>
      )}
    </div>
  );
}

