# PodSDK Demo Web Application

A comprehensive demo application showcasing the features and capabilities of the `@pod/sdk` React library.

## Overview

This demo project provides interactive examples of how to use the PodSDK React library to embed native iOS/Android WebView containers in React web applications. It includes multiple examples covering basic usage, event handling, WebView components, custom buttons, and advanced features.

## Features

- **Basic Usage**: Introduction to PodSDK components and hooks
- **Event Handling**: Send and receive events between web and native
- **WebView Component**: Load URLs and HTML content
- **Custom Buttons**: Various button configurations and styling
- **Advanced Features**: Complex event data, sequential operations, and more

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git SSH access to `git@github.com:mduc2110/pod-sdk-react.git`
- The `@pod/sdk` package will be installed from the GitHub repository

### Installation

1. Install dependencies (this will clone and install the SDK from GitHub):

```bash
npm install
```

The SDK will be automatically installed from the GitHub repository: `git@github.com:mduc2110/pod-sdk-react.git`

**Note:** For local development, if you have the SDK cloned locally at `../pod-sdk-react`, Vite will automatically use the local source files for faster development with hot module replacement. Otherwise, it will use the installed package from `node_modules`.

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

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
├── src/
│   ├── examples/
│   │   ├── BasicExample.tsx       # Basic SDK usage
│   │   ├── EventExample.tsx       # Event handling demo
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
- Wildcard event listeners

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

## Usage in Native Container

To use this demo in a native iOS/Android WebView container:

1. Build the demo application
2. Serve the built files from your server
3. Load the URL in your native WebView container
4. Ensure the PodSDK bridge.js script is loaded in the container

When running in a native container with the bridge available, all features will work as expected. In a regular browser, the bridge will show as unavailable, but the UI and event logging will still function for demonstration purposes.

## Development Notes

- The SDK is installed from GitHub: `git@github.com:mduc2110/pod-sdk-react.git`
- For local development: If you have the SDK cloned at `../pod-sdk-react`, Vite will automatically use the local source files for faster development with hot module replacement
- Hot module replacement is enabled for fast development
- TypeScript is used for type safety
- The app uses React 18 with modern hooks

## Using a Specific Branch or Tag

If you need to use a specific branch or tag of the SDK, you can update `package.json`:

```json
{
  "dependencies": {
    "@pod/sdk": "git+ssh://git@github.com:mduc2110/pod-sdk-react.git#branch-name",
    // or for a tag:
    // "@pod/sdk": "git+ssh://git@github.com:mduc2110/pod-sdk-react.git#v1.0.0"
  }
}
```

## License

MIT

