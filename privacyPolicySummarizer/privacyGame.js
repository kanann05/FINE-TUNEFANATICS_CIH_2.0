// Privacy Gamification System
class PrivacyGameManager {
  constructor() {
    this.defaultStats = {
      score: 0,
      level: 1,
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      achievements: [],
      sitesAnalyzed: 0,
      risksAvoided: 0,
      privacyActionsToday: 0
    };
  }

  async getStats() {
    const result = await chrome.storage.local.get(['privacyStats']);
    return result.privacyStats || this.defaultStats;
  }

  async updateStats(updates) {
    const stats = await this.getStats();
    const newStats = { ...stats, ...updates };
    await chrome.storage.local.set({ privacyStats: newStats });
    return newStats;
  }

  async addXP(amount, reason) {
    const stats = await this.getStats();
    const newXP = stats.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newScore = stats.score + amount;

    const updatedStats = await this.updateStats({
      xp: newXP,
      level: newLevel,
      score: newScore,
      privacyActionsToday: stats.privacyActionsToday + 1
    });

    // Check for level up
    if (newLevel > stats.level) {
      this.showLevelUpNotification(newLevel);
    }

    // Check for new achievements
    this.checkAchievements(updatedStats);

    return updatedStats;
  }
  async checkAchievements(stats) {
    const achievements = [
      {
        id: 'first_analysis',
        name: '🔍 Privacy Detective',
        description: 'Checked your first website for privacy risks',
        condition: () => stats.sitesAnalyzed >= 1,
        xp: 50
      },
      {
        id: 'risk_avoider',
        name: '🛡️ Privacy Guardian',
        description: 'Found 5 websites with data sharing risks',
        condition: () => stats.risksAvoided >= 5,
        xp: 100
      },
      {
        id: 'daily_streak',
        name: '🔥 Privacy Streaker',
        description: 'Used privacy protection 3 days in a row',
        condition: () => stats.streak >= 3,
        xp: 75
      },
      {
        id: 'privacy_pro',
        name: '🥇 Privacy Professional',
        description: 'Became a Level 5 privacy expert',
        condition: () => stats.level >= 5,
        xp: 200
      },
      {
        id: 'site_analyzer',
        name: '📊 Website Expert',
        description: 'Checked privacy on 10 different websites',
        condition: () => stats.sitesAnalyzed >= 10,
        xp: 150
      }
    ];

    for (const achievement of achievements) {
      if (!stats.achievements.includes(achievement.id) && achievement.condition()) {
        stats.achievements.push(achievement.id);
        await this.updateStats({ achievements: stats.achievements });
        this.showAchievementNotification(achievement);
        await this.addXP(achievement.xp, `Achievement: ${achievement.name}`);
      }
    }
  }

  showLevelUpNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-content">
        🎉 LEVEL UP! 🎉<br>
        <strong>Level ${level}</strong><br>
        <span>${this.getLevelTitle(level)}</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <strong>🏆 ACHIEVEMENT UNLOCKED!</strong><br>
        ${achievement.name}<br>
        <small>${achievement.description}</small><br>
        <span class="xp-gain">+${achievement.xp} XP</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  async updateDailyStreak() {
    const stats = await this.getStats();
    const today = new Date().toDateString();
    const lastDate = stats.lastActiveDate;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        // Continuing streak
        await this.updateStats({
          streak: stats.streak + 1,
          lastActiveDate: today,
          privacyActionsToday: 0
        });
      } else {
        // Reset streak
        await this.updateStats({
          streak: 1,
          lastActiveDate: today,
          privacyActionsToday: 0
        });
      }
    }
  }

  getLevelTitle(level) {
    const titles = {
      1: "Privacy Rookie",
      2: "Privacy Learner", 
      3: "Privacy Aware",
      4: "Privacy Guardian",
      5: "Privacy Expert",
      6: "Privacy Master",
      7: "Privacy Ninja",
      8: "Privacy Legend",
      9: "Privacy God",
      10: "Privacy Supreme"
    };
    return titles[level] || "Privacy Supreme";
  }
}

// Global instance
if (typeof window !== 'undefined') {
  window.privacyGame = new PrivacyGameManager();
}
