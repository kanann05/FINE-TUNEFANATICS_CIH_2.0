
const knownSDKs = {
    "google-analytics.com": "Google-analytics", "facebook.net": "Facebook", "amplitude.com": "Amplitude", "segment.io": "Segment", "hotjar.com": "Hotjar", "mixpanel.com": "Mixpanel"
};


chrome.webRequest.onCompleted.addListener(
    function (details) {
        for (const domain in knownSDKs) {
            if (details.url.includes(domain)) {
                chrome.storage.local.get({ logs: [] }, function (data) {
                    const newLog = {
                        method: details.method,
                        url: details.url,
                        sdk: knownSDKs[domain],
                        time: new Date().toLocaleTimeString()
                    };
                    data.logs.push(newLog);
                    chrome.storage.local.set({ logs: data.logs });
                });
                break;
            }
        }


        if (details.type !== "fetch" && details.type !== "xmlhttprequest") return;

    // Only post to popup if it's open and active tab matches
    // if (popupPort && details.tabId === activeTabId) {
    //   popupPort.postMessage({ method: details.method, url: details.url });
    // }


    // Always send to localhost server
    let fn = async () => {
  const { email, password } = await chrome.storage.local.get(["email", "password"]);

    if(email && password) {
await fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: details.method,
        url: details.url,
        fetcher : details.initiator || "Unknown",
        email : email, password : password
      }),
    }).catch((e) => {
      console.error("Failed to send log:", e);
    });
    }  
    }

    if(details.url != 'http://localhost:5000/log' && !details.url.includes("localhost")) {
      fn();
    }
  
    },
    { urls: ["<all_urls>"] }
);
