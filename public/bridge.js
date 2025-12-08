(function () {
    var eventHandlers = {};

    if (!window.Pod) {
        window.Pod = {};
    }

    function onEvent(eventType, callback) {
        if (eventHandlers[eventType] === undefined) {
            eventHandlers[eventType] = [];
        }
        var index = eventHandlers[eventType].indexOf(callback);
        if (index === -1) {
            eventHandlers[eventType].push(callback);
        }
    }

    function offEvent(eventType, callback) {
        if (eventHandlers[eventType] === undefined) {
            return;
        }
        var index = eventHandlers[eventType].indexOf(callback);
        if (index === -1) {
            return;
        }
        eventHandlers[eventType].splice(index, 1);
    }

    function hasNativeHandler() {
        return (
            typeof window.PodBridge !== "undefined" &&
            typeof window.PodBridge.postMessage === "function"
        );
    }

    function postEvent(eventType, callback, eventData) {
        if (!callback) {
            callback = function() {}
        }
        if (eventData === undefined) {
           eventData = '';
        }
        console.log('[Pod.WebView] > postEvent', eventType, eventData);
        if (hasNativeHandler()) {
            try {
                var message = {
                    type: eventType,
                    data: eventData
                };
                window.PodBridge.postMessage(JSON.stringify(message));
                callback();
                return;
            } catch (e) {
                console.error('[Pod.WebView] Failed to post to native:', e);
                callback(e);
                return;
            }
        }

        // Fallback to iframe postMessage (for testing in browser)
        try {
            window.parent.postMessage(JSON.stringify({eventType: eventType, eventData: eventData}), '*');
            callback();
        } catch (e) {
            callback(e);
        }

    }

    function receiveEvent(eventType, eventData) {
        console.log('[Pod.WebView] < receiveEvent', eventType, eventData);
        callEventCallbacks(eventType, function(callback) {
        callback(eventType, eventData);
        });

    }

    function callEventCallbacks(eventType, func) {
        var curEventHandlers = eventHandlers[eventType];
        if (curEventHandlers === undefined ||
            !curEventHandlers.length) {
            return;
        }

        for (var i = 0; i < curEventHandlers.length; i++) {
            try {
                func(curEventHandlers[i]);
            } catch (e) {}

        }

    }

    window.Pod.WebView = {
        onEvent: onEvent,
        offEvent: offEvent,
        postEvent: postEvent,
        receiveEvent: receiveEvent,
        isAvailable: hasNativeHandler
    };
})();

(function() {
    var WebView = window.Pod.WebView;

    function base64ToBlob(base64, mimeType) {
        const byteString = atob(base64);
        const array = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) array[i] = byteString.charCodeAt(i);
        return new Blob([array], { type: mimeType || 'application/octet-stream' });
    }

    WebView.receiveFile = function(payload) {
        console.log('[Pod.WebView] receiveFile payload:', payload);

        // Handle new structure: { items: [...] }
        if (payload && Array.isArray(payload.items)) {
            const items = payload.items;
            console.log('[Pod.WebView] Processing', items.length, 'image(s)');

            items.forEach(function(item, index) {
                if (item.source === 'base64' && item.base64) {
                    const mimeType = item.mime || 'image/jpeg';
                    const blob = base64ToBlob(item.base64, mimeType);
                    const url = URL.createObjectURL(blob);

                    console.log('[Pod.WebView] Image', index + 1, ':');
                    console.log('  - MIME type:', mimeType);
                    console.log('  - URL:', url);
                    console.log('  - Size:', blob.size, 'bytes');
                } else {
                    console.warn('[Pod.WebView] Invalid item format at index', index, ':', item);
                }
            });
            return;
        }

        // Fallback: Handle legacy structure { base64, assetId } for backward compatibility
        if (payload && payload.base64) {
            const blob = base64ToBlob(payload.base64, 'image/jpeg');
            const url = URL.createObjectURL(blob);

            console.log('[Pod.WebView] Legacy format - File URL:', url);
            if (payload.assetId) {
                console.log('[Pod.WebView] Asset ID:', payload.assetId);
            }
            return;
        }

        console.warn('[Pod.WebView] Invalid receiveFile payload format:', payload);
    };

    console.log("Native available:", WebView.isAvailable());

    WebView.postEvent('web_app_initialized');

})();

// function base64ToBlob(base64) {
//     const byteString = atob(base64);
//     const array = new Uint8Array(byteString.length);
//     for (let i = 0; i < byteString.length; i++) array[i] = byteString.charCodeAt(i);
//     return new Blob([array]);
// }

// WebView.receiveFile = function({ base64, assetId }) {
//     const blob = base64ToBlob(base64);
//     const url = URL.createObjectURL(blob);

//     console.log("File URL:", url);
//     console.log("Asset ID:", assetId);
// };