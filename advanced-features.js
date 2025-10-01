// ===== FUNCIONALIDADES AVANÇADAS ADICIONAIS =====

// Sistema de Tema Escuro/Claro
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.applyTheme(this.currentTheme);
  }

  createThemeToggle() {
    const nav = document.querySelector('nav');
    if (nav && !document.getElementById('theme-toggle')) {
      const themeButton = document.createElement('button');
      themeButton.id = 'theme-toggle';
      themeButton.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
      themeButton.title = 'Alternar tema';
      themeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
        padding: 8px;
        border-radius: 50%;
        transition: background 0.3s ease;
      `;

      themeButton.addEventListener('click', () => this.toggleTheme());
      nav.appendChild(themeButton);
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    
    const button = document.getElementById('theme-toggle');
    button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    
    notifications.show(`Tema ${this.currentTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'info', 3000);
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      document.querySelectorAll('img, video').forEach(media => {
        media.style.filter = 'invert(1) hue-rotate(180deg)';
      });
    } else {
      document.body.style.filter = '';
      document.querySelectorAll('img, video').forEach(media => {
        media.style.filter = '';
      });
    }
  }
}

// Sistema de Acessibilidade
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.createAccessibilityMenu();
    this.addKeyboardNavigation();
    this.addSkipLinks();
  }

  createAccessibilityMenu() {
    if (document.getElementById('accessibility-menu')) return;

    const menu = document.createElement('div');
    menu.id = 'accessibility-menu';
    menu.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 2000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      max-width: 250px;
    `;

    menu.innerHTML = `
      <h3 style="margin-bottom: 10px; font-size: 16px;">Acessibilidade</h3>
      <button onclick="accessibility.increaseFontSize()" style="display: block; width: 100%; margin-bottom: 5px; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Aumentar Texto</button>
      <button onclick="accessibility.decreaseFontSize()" style="display: block; width: 100%; margin-bottom: 5px; padding: 5px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Diminuir Texto</button>
      <button onclick="accessibility.toggleHighContrast()" style="display: block; width: 100%; margin-bottom: 5px; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Alto Contraste</button>
      <button onclick="accessibility.toggleMenu()" style="display: block; width: 100%; padding: 5px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
    `;

    document.body.appendChild(menu);

    // Botão para abrir menu
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '♿';
    toggleButton.title = 'Menu de Acessibilidade';
    toggleButton.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #4CAF50;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      z-index: 1999;
      transition: background 0.3s ease;
    `;

    toggleButton.addEventListener('click', () => this.toggleMenu());
    document.body.appendChild(toggleButton);

    this.menu = menu;
    this.menuVisible = false;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.menu.style.transform = this.menuVisible ? 'translateX(60px)' : 'translateX(-100%)';
  }

  increaseFontSize() {
    document.body.style.fontSize = (parseFloat(getComputedStyle(document.body).fontSize) * 1.1) + 'px';
    notifications.show('Tamanho da fonte aumentado', 'success', 2000);
  }

  decreaseFontSize() {
    document.body.style.fontSize = (parseFloat(getComputedStyle(document.body).fontSize) * 0.9) + 'px';
    notifications.show('Tamanho da fonte diminuído', 'success', 2000);
  }

  toggleHighContrast() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    
    if (isHighContrast) {
      const style = document.createElement('style');
      style.id = 'high-contrast-style';
      style.textContent = `
        .high-contrast {
          filter: contrast(150%) brightness(110%);
        }
        .high-contrast * {
          border-color: #000 !important;
          text-shadow: 1px 1px 1px #000 !important;
        }
      `;
      document.head.appendChild(style);
      notifications.show('Alto contraste ativado', 'success', 2000);
    } else {
      const style = document.getElementById('high-contrast-style');
      if (style) style.remove();
      notifications.show('Alto contraste desativado', 'info', 2000);
    }
  }

  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Alt + M para menu de acessibilidade
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.toggleMenu();
      }
      
      // Alt + T para tema
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        if (window.themeManager) {
          window.themeManager.toggleTheme();
        }
      }
    });
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #4CAF50;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 2001;
      transition: top 0.3s ease;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// Sistema de Estatísticas de Uso
class UsageStats {
  constructor() {
    this.stats = JSON.parse(localStorage.getItem('usageStats') || '{}');
    this.init();
  }

  init() {
    this.trackPageView();
    this.trackTimeSpent();
    this.trackUserInteractions();
  }

  trackPageView() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    this.stats.pageViews = this.stats.pageViews || {};
    this.stats.pageViews[page] = (this.stats.pageViews[page] || 0) + 1;
    this.stats.lastVisit = new Date().toISOString();
    this.saveStats();
  }

  trackTimeSpent() {
    this.startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - this.startTime;
      const page = window.location.pathname.split('/').pop() || 'index.html';
      
      this.stats.timeSpent = this.stats.timeSpent || {};
      this.stats.timeSpent[page] = (this.stats.timeSpent[page] || 0) + timeSpent;
      this.saveStats();
    });
  }

  trackUserInteractions() {
    let clickCount = 0;
    
    document.addEventListener('click', () => {
      clickCount++;
      this.stats.totalClicks = (this.stats.totalClicks || 0) + 1;
      
      // Salvar a cada 10 cliques
      if (clickCount % 10 === 0) {
        this.saveStats();
      }
    });
  }

  saveStats() {
    localStorage.setItem('usageStats', JSON.stringify(this.stats));
  }

  getStats() {
    return this.stats;
  }

  showStats() {
    const stats = this.getStats();
    let message = 'Estatísticas de Uso:\n';
    
    if (stats.pageViews) {
      message += 'Páginas visitadas:\n';
      Object.entries(stats.pageViews).forEach(([page, views]) => {
        message += `- ${page}: ${views} visualizações\n`;
      });
    }
    
    if (stats.totalClicks) {
      message += `Total de cliques: ${stats.totalClicks}\n`;
    }
    
    if (stats.lastVisit) {
      message += `Última visita: ${new Date(stats.lastVisit).toLocaleString()}\n`;
    }

    alert(message);
  }
}

// Sistema de Compartilhamento
class ShareSystem {
  constructor() {
    this.init();
  }

  init() {
    this.createShareButtons();
  }

  createShareButtons() {
    const shareContainer = document.createElement('div');
    shareContainer.id = 'share-container';
    shareContainer.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    `;

    const shareButtons = [
      { name: 'WhatsApp', icon: '📱', color: '#25D366' },
      { name: 'Facebook', icon: '📘', color: '#4267B2' },
      { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
      { name: 'Copiar Link', icon: '🔗', color: '#666' }
    ];

    shareButtons.forEach(button => {
      const btn = document.createElement('button');
      btn.innerHTML = button.icon;
      btn.title = `Compartilhar no ${button.name}`;
      btn.style.cssText = `
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: ${button.color};
        color: white;
        border: none;
        font-size: 18px;
        cursor: pointer;
        transition: transform 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;

      btn.addEventListener('click', () => this.share(button.name.toLowerCase()));
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });

      shareContainer.appendChild(btn);
    });

    document.body.appendChild(shareContainer);
  }

  share(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Conheça as belezas de Jaguariúna!');

    let shareUrl;

    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'copiar link':
        navigator.clipboard.writeText(window.location.href).then(() => {
          notifications.show('Link copiado para a área de transferência!', 'success', 3000);
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      notifications.show(`Compartilhando no ${platform}...`, 'info', 2000);
    }
  }
}

// Inicialização dos sistemas adicionais
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar sistemas avançados
  window.themeManager = new ThemeManager();
  window.accessibility = new AccessibilityManager();
  window.usageStats = new UsageStats();
  window.shareSystem = new ShareSystem();

  // Comando secreto para mostrar estatísticas (Ctrl+Shift+S)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      window.usageStats.showStats();
    }
  });

  // Easter egg - Konami Code
  let konamiSequence = [];
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  
  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.code);
    
    if (konamiSequence.length > konamiCode.length) {
      konamiSequence.shift();
    }
    
    if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
      notifications.show('🎉 Código secreto ativado! Você encontrou o Easter Egg do Interiorzando!', 'success', 10000);
      document.body.style.animation = 'rainbow 2s infinite';
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      
      setTimeout(() => {
        document.body.style.animation = '';
      }, 5000);
      
      konamiSequence = [];
    }
  });
});