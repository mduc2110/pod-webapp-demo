import { useEffect, useState } from 'react';
import { usePodSDK } from '@pod/sdk';

interface EventLogItem {
  id: number;
  type: string;
  data?: any;
  timestamp: string;
  direction: 'sent' | 'received';
}

export default function EventExample() {
  const { postEvent, onEvent, isAvailable } = usePodSDK();
  const [eventLog, setEventLog] = useState<EventLogItem[]>([]);

  useEffect(() => {
    if (!isAvailable) return;

    // Subscribe to various event types
    const unsubscribe1 = onEvent('custom_event', (eventData) => {
      addLogItem('custom_event', eventData, 'received');
    });

    const unsubscribe2 = onEvent('web_app_close', () => {
      addLogItem('web_app_close', undefined, 'received');
    });

    const unsubscribe3 = onEvent('web_app_expand', () => {
      addLogItem('web_app_expand', undefined, 'received');
    });

    const unsubscribe4 = onEvent('user_action', (eventData) => {
      addLogItem('user_action', eventData, 'received');
    });

    const unsubscribe5 = onEvent('data_request', (eventData) => {
      addLogItem('data_request', eventData, 'received');
    });

    const unsubscribe6 = onEvent('permission_checked', (eventData) => {
      addLogItem('permission_checked', eventData, 'received');
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
      unsubscribe5();
      unsubscribe6();
    };
  }, [isAvailable, onEvent]);

  const addLogItem = (type: string, data: any, direction: 'sent' | 'received') => {
    setEventLog(prev => [
      {
        id: Date.now(),
        type,
        data,
        timestamp: new Date().toLocaleTimeString(),
        direction,
      },
      ...prev,
    ]);
  };

  const handleSendEvent = (eventType: string, eventData?: any) => {
    postEvent(eventType, eventData, () => {
      addLogItem(eventType, eventData, 'sent');
    });
  };

  const clearLog = () => {
    setEventLog([]);
  };

  return (
    <div className="example-card">
      <h2>Event Handling</h2>
      <p>
        This example demonstrates how to send and receive events between your React app
        and the native container using the PodSDK event system.
      </p>

      <div className="example-section">
        <h3>Send Events</h3>
        <p>Click the buttons below to send different types of events to the native container:</p>
        <div className="button-group">
          <button
            className="demo-button"
            onClick={() => handleSendEvent('custom_event', { message: 'Hello from web!' })}
          >
            Send Custom Event
          </button>
          <button
            className="demo-button"
            onClick={() => handleSendEvent('user_action', { action: 'button_click', id: 123 })}
          >
            Send User Action
          </button>
          <button
            className="demo-button"
            onClick={() => handleSendEvent('web_app_check_permission', { permission: 'gallery' })}
          >
            Gallery permission
          </button>
          <button
            className="demo-button"
            onClick={() => handleSendEvent('data_request', { type: 'user_profile' })}
          >
            Request Data
          </button>
          <button
            className="demo-button secondary"
            onClick={clearLog}
          >
            Clear Log
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Event Log</h3>
        <p>
          Events sent and received are logged below. When running in a native container,
          events from the native side will appear here as well.
        </p>
        <div className="event-log">
          {eventLog.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
              No events yet. Send some events or wait for events from the native container.
            </p>
          ) : (
            eventLog.map(item => (
              <div
                key={item.id}
                className={`event-log-item ${item.direction === 'received' ? 'success' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong>{item.type}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>{item.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Direction: <strong>{item.direction}</strong>
                </div>
                {item.data && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    Data: <code>{JSON.stringify(item.data, null, 2)}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <div className="code-block">
{`import { usePodSDK } from '@pod/sdk';

function EventExample() {
  const { postEvent, onEvent } = usePodSDK();

  useEffect(() => {
    // Subscribe to events
    const unsubscribe = onEvent('custom_event', (eventData) => {
      console.log('Received:', eventData);
    });

    return () => unsubscribe();
  }, [onEvent]);

  const handleSend = () => {
    postEvent('custom_event', { message: 'Hello!' });
  };

  return <button onClick={handleSend}>Send Event</button>;
}`}
        </div>
      </div>

      {!isAvailable && (
        <div className="info-box warning">
          <p>
            <strong>Note:</strong> The bridge is not available in this browser environment.
            Events will be logged but not actually sent to a native container.
          </p>
        </div>
      )}
    </div>
  );
}

