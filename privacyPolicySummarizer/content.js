// Continuous Privacy Alert System
let alertShown = false;
let alertInterval;

function createPrivacyAlert(summary, domain) {
  // Remove existing alerts
  const existingAlert = document.getElementById('privacy-alert-popup');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create floating alert
  const alertDiv = document.createElement('div');
  alertDiv.id = 'privacy-alert-popup';
  alertDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff4444, #cc0000);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 350px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      animation: privacyPulse 2s infinite;
      cursor: pointer;
      border: 2px solid #fff;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 20px; margin-right: 8px;">⚠️</span>
        <strong>PRIVACY ALERT: ${domain.toUpperCase()}</strong>
        <span style="margin-left: auto; font-size: 18px;" onclick="document.getElementById('privacy-alert-popup').remove()">×</span>
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        This website collects your personal data!
        <br><strong>Click to see what they're tracking</strong>
      </div>
    </div>
    <style>
      @keyframes privacyPulse {
        0% { transform: scale(1); box-shadow: 0 4px 20px rgba(255,68,68,0.3); }
        50% { transform: scale(1.05); box-shadow: 0 6px 25px rgba(255,68,68,0.6); }
        100% { transform: scale(1); box-shadow: 0 4px 20px rgba(255,68,68,0.3); }
      }
    </style>
  `;

  // Add click handler to show full summary
  alertDiv.onclick = () => {
    showFullPrivacySummary(summary, domain);
  };

  document.body.appendChild(alertDiv);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (document.getElementById('privacy-alert-popup')) {
      document.getElementById('privacy-alert-popup').remove();
    }
  }, 10000);
}

function showFullPrivacySummary(summary, domain) {
  // Remove alert popup
  const alertPopup = document.getElementById('privacy-alert-popup');
  if (alertPopup) alertPopup.remove();

  // Create full summary overlay
  const overlay = document.createElement('div');
  overlay.id = 'privacy-summary-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      ">
        <div style="
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        " onclick="document.getElementById('privacy-summary-overlay').remove()">×</div>
        
        <h2 style="color: #d32f2f; margin-top: 0;">🔐 Privacy Analysis: ${domain}</h2>
        <div id="summary-content">${formatSummary(summary)}</div>
        
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="document.getElementById('privacy-summary-overlay').remove()" style="
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          ">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function formatSummary(summary) {
  return summary
    .replace(/\[DATA\](.*?)(\n|$)/g, '<div style="background: #e3f2fd; color: #1565c0; padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 4px solid #2196f3;">🔵 <strong>Data Collected:</strong> $1</div>')
    .replace(/\[USE\](.*?)(\n|$)/g, '<div style="background: #fff8e1; color: #f57c00; padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 4px solid #ff9800;">🟡 <strong>Used For:</strong> $1</div>')
    .replace(/\[RISK\](.*?)(\n|$)/g, '<div style="background: #ffebee; color: #c62828; padding: 10px; margin: 8px 0; border-radius: 6px; border-left: 4px solid #f44336;">🔴 <strong>Privacy Risk:</strong> $1</div>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function startContinuousAlerts() {
  // Clear any existing interval
  if (alertInterval) {
    clearInterval(alertInterval);
  }
  
  // Show alert every 30 seconds
  alertInterval = setInterval(() => {
    chrome.storage.local.get(['summary', 'domain', 'alertsDisabled'], ({ summary, domain, alertsDisabled }) => {
      if (summary && domain && !document.getElementById('privacy-alert-popup') && !alertsDisabled) {
        createPrivacyAlert(summary, domain);
      }
    });
  }, 30000); // 30 seconds
}

function extractPrivacyInfo() {
  const pageText = document.body.innerText || '';
  const pageUrl = window.location.href;
  const pageTitle = document.title || '';
  
  // Find privacy-related links
  const privacyLinks = Array.from(document.querySelectorAll('a'))
    .map(link => link.href)
    .filter(href => href && /(privacy|terms|policy|conditions|cookie)/i.test(href))
    .slice(0, 5);

  return {
    pageText: pageText.slice(0, 5000),
    url: pageUrl,
    title: pageTitle,
    links: privacyLinks
  };
}

// Gaming notification system
function injectGamingCSS() {
  if (document.getElementById('privacy-gaming-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'privacy-gaming-styles';
  style.textContent = `
    .level-up-notification, .achievement-notification {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 10000 !important;
      background: linear-gradient(135deg, #FFD700, #FFA500) !important;
      color: white !important;
      padding: 15px 20px !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
      animation: slideInBounce 0.5s ease !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
    }

    .level-up-content, .achievement-content {
      text-align: center !important;
      font-weight: bold !important;
    }

    .xp-gain {
      color: #90EE90 !important;
      font-size: 12px !important;
    }

    @keyframes slideInBounce {
      0% {
        transform: translateX(100%) scale(0.8) !important;
        opacity: 0 !important;
      }
      60% {
        transform: translateX(-10%) scale(1.1) !important;
        opacity: 1 !important;
      }
      100% {
        transform: translateX(0) scale(1) !important;
        opacity: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize on page load
try {
  chrome.runtime.sendMessage({
    type: "PRIVACY_TEXT",
    payload: extractPrivacyInfo()
  });
    // Start continuous alerts after 5 seconds (unless disabled)
  setTimeout(() => {
    chrome.storage.local.get(['alertsDisabled'], ({ alertsDisabled }) => {
      if (!alertsDisabled) {
        startContinuousAlerts();
      }
    });
  }, 5000);
  
} catch (error) {
  // Ignore messaging errors
}

// Inject CSS when content script loads
injectGamingCSS();

// Stop alerts when user leaves the page
window.addEventListener('beforeunload', () => {
  if (alertInterval) {
    clearInterval(alertInterval);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STOP_ALERTS') {
    if (alertInterval) {
      clearInterval(alertInterval);
      alertInterval = null;
    }
    // Remove any existing alerts
    const existingAlert = document.getElementById('privacy-alert-popup');
    if (existingAlert) existingAlert.remove();
    const existingOverlay = document.getElementById('privacy-summary-overlay');
    if (existingOverlay) existingOverlay.remove();
  } else if (message.type === 'START_ALERTS') {
    startContinuousAlerts();
  }
});
