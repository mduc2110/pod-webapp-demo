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

    console.log("WebView bridge loaded");

    console.log("Native available:", WebView.isAvailable());



    WebView.postEvent('web_app_initialized');

})();

