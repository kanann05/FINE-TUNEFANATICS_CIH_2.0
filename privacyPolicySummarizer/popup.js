function applyHighlighting(summary) {
  // Check if summary is valid before processing
  if (!summary || typeof summary !== 'string') {
    return "❌ No privacy analysis available.";
  }
  
  return summary
    .replace(/\[DATA\](.*?)(\n|$)/g, '<div class="data">🔵 <strong>What They Collect:</strong> $1</div>')
    .replace(/\[USE\](.*?)(\n|$)/g, '<div class="use">🟡 <strong>How They Use It:</strong> $1</div>')
    .replace(/\[RISK\](.*?)(\n|$)/g, '<div class="risk">🔴 <strong>Data Sharing Risk:</strong> $1</div>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\n/g, '<br>'); // Line breaks
}

async function displayGamingStats() {
  const result = await chrome.storage.local.get(['privacyStats']);
  const stats = result.privacyStats || {
    score: 0, level: 1, xp: 0, streak: 0, 
    achievements: [], sitesAnalyzed: 0, risksAvoided: 0
  };

  const xpToNext = 100 - (stats.xp % 100);
  const levelTitles = {
    1: "Privacy Rookie", 2: "Privacy Learner", 3: "Privacy Aware",
    4: "Privacy Guardian", 5: "Privacy Expert", 6: "Privacy Master",
    7: "Privacy Ninja", 8: "Privacy Legend", 9: "Privacy God", 10: "Privacy Supreme"
  };
  const levelTitle = levelTitles[stats.level] || "Privacy Supreme";
  return `
    <div class="gaming-stats">
      <div class="level-info">
        <span class="level-badge">Level ${stats.level}</span>
        <span class="level-title">${levelTitle}</span>
      </div>
      <div class="xp-bar">
        <div class="xp-fill" style="width: ${(stats.xp % 100)}%"></div>
        <span class="xp-text">${stats.xp % 100}/100 XP</span>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">${stats.score}</div>
          <div class="stat-label">Privacy Points</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.streak}</div>
          <div class="stat-label">Daily Streak</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.sitesAnalyzed}</div>
          <div class="stat-label">Sites Checked</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.achievements.length}</div>
          <div class="stat-label">Badges Earned</div>
        </div>
      </div>
      ${stats.achievements.length > 0 ? `
        <div class="achievements">
          <h4>🏆 Your Badges</h4>
          ${stats.achievements.slice(-3).map(id => {            const achievementNames = {
              'first_analysis': '🔍 Privacy Detective',
              'risk_avoider': '🛡️ Privacy Guardian', 
              'daily_streak': '🔥 Privacy Streaker',
              'privacy_pro': '🥇 Privacy Professional',
              'site_analyzer': '📊 Website Expert'
            };
            return `<div class="achievement">${achievementNames[id] || id}</div>`;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// Load and display privacy summary with gaming stats at bottom
chrome.storage.local.get(['summary', 'domain', 'riskLevel'], async ({ summary, domain, riskLevel }) => {
  const box = document.getElementById("summaryBox");
  
  let content = '';

  if (!summary || summary.trim() === "") {
    content += `
      <div class="summary-content">        <div style="text-align: center; padding: 20px;">
          <p>🔄 <strong>Checking website...</strong></p>
          <p>Visit a website to start earning points!</p>
        </div>
      </div>
    `;
  } else {
    // Risk level indicator
    const riskColors = {
      'HIGH': { color: '#ff0000', text: 'HIGH RISK', icon: '🚨' },
      'MED': { color: '#ff8800', text: 'MEDIUM RISK', icon: '⚠️' },
      'LOW': { color: '#4CAF50', text: 'LOW RISK', icon: '✅' }
    };
    
    const risk = riskColors[riskLevel] || riskColors['LOW'];

    // Add domain info and risk level
    if (domain) {
      content += `
        <div style="background: #f0f0f0; padding: 12px; margin-bottom: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><strong>📍 Website:</strong> ${domain}</div>
            <div style="
              background: ${risk.color}; 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: bold;
            ">
              ${risk.icon} ${risk.text}
            </div>
          </div>
        </div>
      `;
    }
    
    content += `<div class="summary-content">${applyHighlighting(summary)}</div>`;
    
    // Add continuous alerts info
    content += `
      <div style="
        background: #e8f5e8; 
        border: 1px solid #4CAF50; 
        padding: 10px; 
        border-radius: 6px; 
        margin-top: 15px; 
        font-size: 12px;
        text-align: center;
      ">
        🔔 <strong>Continuous Alerts Active</strong><br>
        You'll get privacy notifications every 30 seconds
      </div>
    `;
  }
  // Add gaming call-to-action
  content += `
    <div class="gaming-cta">
      <button id="refreshBtn" class="refresh-btn">
        🔄 Check This Website (+10 Points)
      </button>
      <div class="privacy-tip">
        💡 Tip: Visit different websites to earn more points and level up!
      </div>
    </div>
  `;

  // Add gaming stats at the bottom
  const gamingStats = await displayGamingStats();
  content += gamingStats;

  box.innerHTML = content;

  // Add refresh functionality
  document.getElementById("refreshBtn")?.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  });
});

// Add toggle alerts button instead of refresh
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '� Disable Alerts';
  toggleBtn.id = 'alert-toggle';
  toggleBtn.style.cssText = `
    width: 100%; 
    padding: 10px; 
    margin-top: 10px; 
    background: #ff4444; 
    color: white; 
    border: none; 
    border-radius: 6px; 
    cursor: pointer;
    font-size: 14px;
  `;
  
  // Check if alerts are disabled
  chrome.storage.local.get(['alertsDisabled'], ({ alertsDisabled }) => {
    if (alertsDisabled) {
      toggleBtn.textContent = '🔔 Enable Alerts';
      toggleBtn.style.background = '#4CAF50';
    }
  });
  
  toggleBtn.onclick = () => {
    chrome.storage.local.get(['alertsDisabled'], ({ alertsDisabled }) => {
      const newState = !alertsDisabled;
      chrome.storage.local.set({ alertsDisabled: newState });
      
      if (newState) {
        toggleBtn.textContent = '🔔 Enable Alerts';
        toggleBtn.style.background = '#4CAF50';
        
        // Send message to content script to stop alerts
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_ALERTS' });
        });
      } else {
        toggleBtn.textContent = '🔕 Disable Alerts';
        toggleBtn.style.background = '#ff4444';
        
        // Send message to content script to start alerts
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'START_ALERTS' });
        });
      }
    });
  };
  
  document.body.appendChild(toggleBtn);
});

