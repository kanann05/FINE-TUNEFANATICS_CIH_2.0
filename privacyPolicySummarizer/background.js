// Privacy Gamification System
importScripts('privacyGame.js');

// Initialize gaming system
let privacyGame;
try {
  privacyGame = new PrivacyGameManager();
} catch (e) {
  console.log('Gaming system not available');
}

// Simple Privacy Pattern Analyzer - Works instantly!
function analyzePrivacyPatterns(text, url) {
  const domain = new URL(url).hostname.replace('www.', '');
  
  // Data collection patterns
  const dataPatterns = [
    { pattern: /(email|e-mail)/gi, type: 'Email addresses' },
    { pattern: /(phone|mobile|telephone)/gi, type: 'Phone numbers' },
    { pattern: /(location|GPS|geolocation)/gi, type: 'Location data' },
    { pattern: /(cookie|tracking|pixel)/gi, type: 'Cookies & trackers' },
    { pattern: /(IP address|internet protocol)/gi, type: 'IP addresses' },
    { pattern: /(device|browser|operating system)/gi, type: 'Device info' },
    { pattern: /(photo|image|upload)/gi, type: 'Photos & uploads' }
  ];

  // Usage patterns
  const usePatterns = [
    { pattern: /(advertis|marketing|promotion)/gi, type: 'Advertising & marketing' },
    { pattern: /(analytics|track|monitor)/gi, type: 'Analytics & tracking' },
    { pattern: /(improve|enhance|personalize)/gi, type: 'Service improvement' },
    { pattern: /(share|sell|transfer|disclose)/gi, type: 'Data sharing' },
    { pattern: /(security|protect|fraud)/gi, type: 'Security purposes' }
  ];

  // Risk patterns
  const riskPatterns = [
    { pattern: /(third.party|partner|affiliate)/gi, type: 'Shared with third parties' },
    { pattern: /(sell|sold|transfer)/gi, type: 'Data may be sold' },
    { pattern: /(retain|store|keep)/gi, type: 'Long-term data storage' },
    { pattern: /(international|overseas|global)/gi, type: 'International transfers' }
  ];

  // Analyze patterns
  const foundData = dataPatterns.filter(p => p.pattern.test(text));
  const foundUses = usePatterns.filter(p => p.pattern.test(text));
  const foundRisks = riskPatterns.filter(p => p.pattern.test(text));

  // Generate summary
  let summary = `📱 **${domain.toUpperCase()} Privacy Analysis**\n\n`;

  if (foundData.length > 0) {
    summary += foundData.map(d => `[DATA] ${d.type}`).join('\n') + '\n\n';
  } else {
    summary += '[DATA] Basic usage data (cookies, IP address)\n\n';
  }

  if (foundUses.length > 0) {
    summary += foundUses.map(u => `[USE] ${u.type}`).join('\n') + '\n\n';
  } else {
    summary += '[USE] Service functionality and user experience\n\n';
  }

  if (foundRisks.length > 0) {
    summary += foundRisks.map(r => `[RISK] ${r.type}`).join('\n');
  } else {
    summary += '[RISK] Standard data collection practices';
  }

  return summary;
}

// Predefined summaries for popular sites
const knownSites = {
  'instagram.com': `[DATA] Photos, messages, location, contacts, device info
[USE] Content personalization, ads targeting, analytics
[RISK] Data shared with Facebook/Meta and advertisers`,

  'facebook.com': `[DATA] Posts, photos, messages, location, browsing activity
[USE] Targeted advertising, content recommendations
[RISK] Extensive data sharing with third-party partners`,

  'google.com': `[DATA] Search history, location, voice recordings, emails
[USE] Personalized ads, service improvement, AI training
[RISK] Data retained indefinitely, shared across Google services`,

  'youtube.com': `[DATA] Watch history, comments, uploads, device info
[USE] Video recommendations, targeted ads
[RISK] Data shared with Google and content creators`,

  'tiktok.com': `[DATA] Videos, biometric data, location, device info
[USE] Algorithm training, content moderation, advertising
[RISK] International data transfers, extensive tracking`,

  'twitter.com': `[DATA] Tweets, DMs, location, contacts, browsing activity
[USE] Timeline personalization, ad targeting, analytics
[RISK] Public data mining, advertiser data sharing`
};

// Calculate privacy risk level
function getPrivacyRiskLevel(summary) {
  const riskKeywords = ['sell', 'share', 'third party', 'partner', 'advertiser', 'tracking', 'biometric'];
  const riskCount = riskKeywords.filter(keyword => summary.toLowerCase().includes(keyword)).length;
  
  if (riskCount >= 4) return 'HIGH';
  if (riskCount >= 2) return 'MED';
  return 'LOW';
}

// Update extension badge based on risk
function updateBadge(tabId, riskLevel) {
  const badgeConfig = {
    'HIGH': { text: '!!!', color: '#ff0000' },
    'MED': { text: '!!', color: '#ff8800' },
    'LOW': { text: '!', color: '#4CAF50' }
  };
  
  const config = badgeConfig[riskLevel];
  chrome.action.setBadgeText({ text: config.text, tabId });
  chrome.action.setBadgeBackgroundColor({ color: config.color, tabId });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "PRIVACY_TEXT") {
    const { pageText, links, url } = message.payload;
    
    try {
      const domain = new URL(sender.tab.url).hostname.replace('www.', '');
      
      // Use predefined summary if available
      let summary;
      if (knownSites[domain]) {
        summary = knownSites[domain];
      } else {        // Analyze patterns in the text
        summary = analyzePrivacyPatterns(pageText, sender.tab.url);
      }

      // Calculate risk level and update badge
      const riskLevel = getPrivacyRiskLevel(summary);
      updateBadge(sender.tab.id, riskLevel);

      await chrome.storage.local.set({ 
        summary: summary,
        links: links || [],
        domain: domain,
        riskLevel: riskLevel
      });

      // 🎮 GAMING: Award XP for analyzing privacy policy
      if (privacyGame) {
        try {
          await privacyGame.addXP(10, "Analyzed privacy policy");
          await privacyGame.updateDailyStreak();
          
          // Update stats
          const stats = await privacyGame.getStats();
          await privacyGame.updateStats({
            sitesAnalyzed: stats.sitesAnalyzed + 1
          });

          // 🎮 GAMING: Award bonus XP for avoiding high-risk sites
          if (riskLevel === 'HIGH') {
            await privacyGame.addXP(25, "Identified high-risk site");
            await privacyGame.updateStats({
              risksAvoided: stats.risksAvoided + 1
            });
          }
        } catch (gamingError) {
          console.log('Gaming system error:', gamingError);
        }
      }

      // Trigger notification for high-risk sites
      if (riskLevel === 'HIGH') {
        chrome.action.setBadgeText({ text: 'WARN', tabId: sender.tab.id });
        chrome.action.setBadgeBackgroundColor({ color: '#ff0000', tabId: sender.tab.id });
      }
      
    } catch (error) {
      await chrome.storage.local.set({ 
        summary: '[DATA] Standard user data collection\n[USE] Service functionality\n[RISK] Basic privacy practices',
        links: [],
        domain: 'unknown',
        riskLevel: 'LOW'
      });
    }
  }
});

// Clear badge when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: '', tabId });
});
