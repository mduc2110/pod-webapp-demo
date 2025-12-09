# PodSDK Demo Web Application

A comprehensive demo application showcasing the features and capabilities of the `@pod/sdk` React library.

## Overview

This demo project provides interactive examples of how to use the PodSDK React library to embed native iOS/Android WebView containers in React web applications. It includes multiple examples covering basic usage, event handling, WebView components, custom buttons, image uploads, and advanced features.

## Features

- **Basic Usage**: Introduction to PodSDK components and hooks
- **Event Handling**: Send and receive events between web and native
- **Image Upload**: Request and display images from native gallery using `useUploadImage` hook
- **WebView Component**: Load URLs and HTML content
- **Custom Buttons**: Various button configurations and styling
- **Advanced Features**: Complex event data, sequential operations, and more

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git SSH access to `git@bitbucket.org:hasaki-tech/pod-web-bridge.git`
- The `@pod/sdk` package will be installed from the Bitbucket repository

### Installation

1. **Clear cache and install dependencies** (recommended for fresh install):

```bash
# Clear npm cache and remove existing installation
rm -rf node_modules package-lock.json && npm cache clean --force

# Install dependencies (this will clone and install the SDK from Bitbucket)
npm install
```

Or simply:
```bash
npm install
```

The SDK will be automatically installed from the Bitbucket repository: `git+ssh://git@bitbucket.org:hasaki-tech/pod-web-bridge.git`

**Note:** 
- Make sure your SSH key is configured for Bitbucket access
- For local development, if you have the SDK cloned locally, you can use `file:../path-to-sdk` in `package.json` instead

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in the terminal output)

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
pod-webapp-demo/
├── public/
│   └── bridge.js                   # PodSDK bridge script for native communication
├── src/
│   ├── examples/
│   │   ├── BasicExample.tsx       # Basic SDK usage
│   │   ├── EventExample.tsx       # Event handling and image upload demo
│   │   ├── WebViewExample.tsx     # WebView component demo
│   │   ├── CustomButtonExample.tsx # Custom buttons demo
│   │   └── AdvancedExample.tsx    # Advanced features demo
│   ├── App.tsx                     # Main app component
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Examples

### Basic Usage

Demonstrates:
- Setting up `PodSDKProvider`
- Using `PodButton` component
- Using `usePodEvent` hook
- Checking bridge availability

### Event Handling

Demonstrates:
- Sending events to native
- Receiving events from native
- Event logging and monitoring
- Image upload from native gallery using `useUploadImage` hook
- Displaying multiple uploaded images in a grid

### WebView Component

Demonstrates:
- Loading URLs in WebView
- Loading HTML content directly
- WebView callbacks
- Dynamic content switching

### Custom Buttons

Demonstrates:
- Different PodButton configurations
- Custom styling
- onClick handlers
- Creating custom buttons with hooks

### Advanced Features

Demonstrates:
- Complex nested event data
- Sequential event operations
- Event callbacks
- WebView control methods
- Wildcard event listeners

## Available Hooks

- `usePodEvent()` - Main hook for event handling (replaces `usePodSDK`)
  - `postEvent(eventType, eventData?, callback?)` - Send events to native
  - `onEvent(eventType, callback)` - Subscribe to events (returns unsubscribe function)
  - `offEvent(eventType, callback)` - Unsubscribe from events
  - `isAvailable` - Check if native bridge is available

- `useUploadImage(callbacks?)` - Hook for uploading images from native gallery
  - `requestImage(data?)` - Request images from native gallery
  - `onFileReceived(file)` - Callback when images are received (receives `{ items: PodFileItem[] }`)
  - `onError(error)` - Error callback

- `usePodWebView(callbacks?)` - Hook for WebView control
  - `close()`, `ready()`, `expand()` - WebView control methods
  - `checkPermission(permission, callback?)` - Check native permissions

## Usage in Native Container

To use this demo in a native iOS/Android WebView container:

1. Build the demo application:
   ```bash
   npm run build
   ```

2. Serve the built files from your server (the `dist` directory)

3. Load the URL in your native WebView container

4. Ensure the PodSDK `bridge.js` script is loaded in the container (located in `public/bridge.js`)

When running in a native container with the bridge available, all features will work as expected. In a regular browser, the bridge will show as unavailable, but the UI and event logging will still function for demonstration purposes.

## Image Upload Feature

The `useUploadImage` hook allows you to request images from the native gallery. The hook receives an array of image items with the following structure:

```typescript
{
  items: [
    {
      mime: "image/jpeg",
      source: "base64",
      base64: "<base64-encoded-image-data>"
    }
  ]
}
```

See `EventExample.tsx` for a complete implementation example.

## Development Notes

- The SDK is installed from Bitbucket: `git+ssh://git@bitbucket.org:hasaki-tech/pod-web-bridge.git`
- For local development: If you have the SDK cloned locally, you can use `file:../path-to-sdk` in `package.json` instead of the git URL
- Hot module replacement is enabled for fast development
- TypeScript is used for type safety
- The app uses React 18 with modern hooks
- Code formatting uses 4-space indentation

## Using a Specific Branch or Tag

If you need to use a specific branch or tag of the SDK, you can update `package.json`:

```json
{
  "dependencies": {
    "@pod/sdk": "git+ssh://git@bitbucket.org:hasaki-tech/pod-web-bridge.git#branch-name",
    // or for a tag:
    // "@pod/sdk": "git+ssh://git@bitbucket.org:hasaki-tech/pod-web-bridge.git#v1.0.0",
    // or for a specific commit:
    // "@pod/sdk": "git+ssh://git@bitbucket.org:hasaki-tech/pod-web-bridge.git#commit-hash"
  }
}
```

After updating, clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json && npm cache clean --force && npm install
```

## License

MIT

