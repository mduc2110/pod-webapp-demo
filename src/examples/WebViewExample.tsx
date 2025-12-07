import { useState } from 'react';
import { PodWebView } from '@pod/sdk';

export default function WebViewExample() {
  const [url, setUrl] = useState('https://example.com');
  const [customUrl, setCustomUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [mode, setMode] = useState<'url' | 'html'>('url');

  const handleLoadUrl = () => {
    if (customUrl.trim()) {
      setUrl(customUrl.trim());
      setMode('url');
    }
  };

  const handleLoadHtml = () => {
    if (htmlContent.trim()) {
      setMode('html');
    }
  };

  return (
    <div className="example-card">
      <h2>WebView Component</h2>
      <p>
        The <code>PodWebView</code> component allows you to embed web content or URLs
        within your React app. It's designed to work seamlessly with native WebView containers.
      </p>

      <div className="example-section">
        <h3>Load URL</h3>
        <p>Enter a URL to load in the WebView:</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLoadUrl()}
          />
          <button className="demo-button" onClick={handleLoadUrl}>
            Load URL
          </button>
        </div>
        <div className="button-group">
          <button
            className="demo-button secondary"
            onClick={() => {
              setUrl('https://example.com');
              setMode('url');
            }}
          >
            Example.com
          </button>
          <button
            className="demo-button secondary"
            onClick={() => {
              setUrl('https://react.dev');
              setMode('url');
            }}
          >
            React.dev
          </button>
          <button
            className="demo-button secondary"
            onClick={() => {
              setUrl('https://github.com');
              setMode('url');
            }}
          >
            GitHub
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>Load HTML Content</h3>
        <p>Enter HTML content to render directly:</p>
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="<h1>Hello World</h1><p>This is custom HTML content.</p>"
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            marginBottom: '1rem',
          }}
        />
        <button className="demo-button" onClick={handleLoadHtml}>
          Load HTML
        </button>
      </div>

      <div className="example-section">
        <h3>WebView Display</h3>
        <div className="webview-container">
          {mode === 'url' ? (
            <PodWebView
              url={url}
              callbacks={{
                onInitialized: () => {
                  console.log('WebView initialized');
                },
                onClose: () => {
                  console.log('WebView closed');
                },
                onError: (error) => {
                  console.error('WebView error:', error);
                },
              }}
            />
          ) : (
            <PodWebView
              html={htmlContent || '<div style="padding: 2rem; text-align: center;"><h1>No HTML content</h1><p>Enter HTML above and click "Load HTML"</p></div>'}
              callbacks={{
                onInitialized: () => {
                  console.log('WebView initialized');
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <div className="code-block">
{`import { PodWebView } from '@pod/sdk';

function WebViewExample() {
  return (
    <div>
      {/* Load from URL */}
      <PodWebView
        url="https://example.com"
        callbacks={{
          onInitialized: () => console.log('Ready'),
          onClose: () => console.log('Closed'),
        }}
      />

      {/* Load HTML directly */}
      <PodWebView
        html="<h1>Hello World</h1>"
        style={{ height: '400px' }}
      />
    </div>
  );
}`}
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>Note:</strong> When running in a browser, the WebView component renders
          an iframe. In a native container, it will use the native WebView implementation.
        </p>
      </div>
    </div>
  );
}

