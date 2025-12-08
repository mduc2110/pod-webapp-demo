import { useCallback, useEffect, useState } from 'react';
import { usePodEvent, useUploadImage, type PodFilePayload, type PodFileItem } from '@pod/sdk';

interface EventLogItem {
    id: number;
    type: string;
    data?: any;
    timestamp: string;
    direction: 'sent' | 'received';
}

interface UploadedImage {
    id: string;
    src: string;
    mime: string;
    size: number;
}

export default function EventExample() {
    const { postEvent, onEvent, isAvailable } = usePodEvent();
    const [eventLog, setEventLog] = useState<EventLogItem[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const addLogItem = useCallback((type: string, data: any, direction: 'sent' | 'received') => {
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
    }, []);

    const { requestImage } = useUploadImage({
        onFileReceived: (file: PodFilePayload) => {
            try {
                // File structure: { items: PodFileItem[] }
                const items = file?.items;
                if (!Array.isArray(items) || items.length === 0) {
                    throw new Error('Invalid file payload: items array is required');
                }

                const newImages: UploadedImage[] = items.map((item: PodFileItem, index: number) => {
                    const src = `data:${item.mime};base64,${item.base64}`;
                    return {
                        id: `${Date.now()}-${index}`,
                        src,
                        mime: item.mime,
                        size: item.base64.length,
                    };
                });

                setUploadedImages(prev => [...newImages, ...prev]);
                setUploadError(null);
                addLogItem('web_app_pick_image', { 
                    count: newImages.length,
                    items: newImages.map(img => ({ mime: img.mime, size: img.size }))
                }, 'received');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to process images';
                setUploadError(message);
                addLogItem('web_app_pick_image_error', { message }, 'received');
            }
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to receive image';
            setUploadError(message);
            addLogItem('web_app_pick_image_error', { message }, 'received');
        },
    });

    useEffect(() => {
        if (!isAvailable) return;

        // Subscribe to various event types
        const unsubscribe1 = onEvent('custom_event', (eventData?: any) => {
            addLogItem('custom_event', eventData, 'received');
        });

        const unsubscribe2 = onEvent('web_app_close', () => {
            addLogItem('web_app_close', undefined, 'received');
        });

        const unsubscribe3 = onEvent('web_app_expand', () => {
            addLogItem('web_app_expand', undefined, 'received');
        });

        const unsubscribe4 = onEvent('user_action', (eventData?: any) => {
            addLogItem('user_action', eventData, 'received');
        });

        const unsubscribe5 = onEvent('data_request', (eventData?: any) => {
            addLogItem('data_request', eventData, 'received');
        });

        const unsubscribe6 = onEvent('permission_checked', (eventData?: any) => {
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
    }, [addLogItem, isAvailable, onEvent]);

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
                <h3>Upload Image (native gallery)</h3>
                <p>
                    The <code>useUploadImage</code> hook requests images from the native gallery and surfaces the
                    returned file payload with an array of items.
                </p>
                <div className="button-group">
                    <button
                        className="demo-button"
                        onClick={() => requestImage({ source: 'event_example' })}
                        disabled={!isAvailable}
                    >
                        Request images from native
                    </button>
                    {uploadedImages.length > 0 && (
                        <button
                            className="demo-button secondary"
                            onClick={() => setUploadedImages([])}
                        >
                            Clear Images
                        </button>
                    )}
                </div>
                {!isAvailable && (
                    <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Bridge not available in browser. Button will work inside the native container.
                    </p>
                )}
                {uploadError && (
                    <div className="info-box warning" style={{ marginTop: '0.75rem' }}>
                        <p>{uploadError}</p>
                    </div>
                )}
                <div style={{ marginTop: '0.75rem' }}>
                    {uploadedImages.length > 0 ? (
                        <div>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                <strong>{uploadedImages.length}</strong> image(s) received and displayed below:
                            </p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                {uploadedImages.map((image) => (
                                    <div
                                        key={image.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            backgroundColor: '#f9fafb'
                                        }}
                                    >
                                        <img
                                            src={image.src}
                                            alt={`Uploaded ${image.mime}`}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                        <div style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                                            <div style={{ color: '#444', marginBottom: '0.25rem' }}>
                                                <strong>Type:</strong> {image.mime}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.8rem' }}>
                                                Size: {(image.size / 1024).toFixed(2)} KB
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="info-box">
                            <p style={{ color: '#666' }}>
                                No images received yet. Tap "Request images from native" inside the container to trigger the upload flow.
                            </p>
                        </div>
                    )}
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
                <h3>Code Example - Events</h3>
                <div className="code-block">
{`import { usePodEvent } from '@pod/sdk';

function EventExample() {
    const { postEvent, onEvent } = usePodEvent();

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

            <div className="example-section">
                <h3>Code Example - Image Upload</h3>
                <div className="code-block">
{`import { useState } from 'react';
import { useUploadImage } from '@pod/sdk';

function ImageUploadExample() {
    const [images, setImages] = useState([]);

    const { requestImage } = useUploadImage({
        onFileReceived: (file) => {
            // File structure: { items: PodFileItem[] }
            const items = file?.items;
            if (!Array.isArray(items)) return;

            // Process each item in the array
            const newImages = items.map((item) => ({
                id: \`\${Date.now()}-\${Math.random()}\`,
                src: \`data:\${item.mime};base64,\${item.base64}\`,
                mime: item.mime,
            }));
            setImages(prev => [...newImages, ...prev]);
        },
        onError: (error) => {
            console.error('Upload error:', error);
        },
    });

    return (
        <div>
            <button onClick={() => requestImage()}>
                Pick Images
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {images.map((img) => (
                    <img key={img.id} src={img.src} alt={img.mime} />
                ))}
            </div>
        </div>
    );
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
