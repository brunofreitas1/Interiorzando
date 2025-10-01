// ===== SISTEMA DE NOTIFICAÇÕES E ALERTAS =====
class NotificationSystem {
  constructor() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
      success: '#4CAF50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196F3'
    };

    notification.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      position: relative;
      cursor: pointer;
      font-family: inherit;
      line-height: 1.4;
    `;

    notification.innerHTML = `
      <span>${message}</span>
      <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 18px; cursor: pointer;">&times;</span>
    `;

    document.getElementById('notification-container').appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remover
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    // Remover ao clicar
    notification.addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  remove(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

const notifications = new NotificationSystem();

// ===== SISTEMA DE VALIDAÇÃO DE FORMULÁRIO =====
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.errors = {};
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm();
    });

    // Validação em tempo real
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';

    // Reset previous error
    this.clearFieldError(field);

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'E-mail inválido';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = 'Telefone deve estar no formato (00) 00000-0000';
      }
    }

    // Name validation
    if (fieldName === 'nome' && value) {
      if (value.length < 2) {
        isValid = false;
        message = 'Nome deve ter pelo menos 2 caracteres';
      }
    }

    if (!isValid) {
      this.showFieldError(field, message);
      this.errors[fieldName] = message;
    } else {
      delete this.errors[fieldName];
    }

    return isValid;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitForm();
    } else {
      notifications.show('Por favor, corrija os erros antes de enviar', 'error');
    }
  }

  showFieldError(field, message) {
    field.style.borderColor = '#f44336';
    
    // Remove error message anterior
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
      color: #f44336;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  submitForm() {
    // Mostrar loading
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simular envio
    setTimeout(() => {
      notifications.show('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      this.form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 2000);
  }
}

// ===== SISTEMA DE FAVORITOS =====
class FavoriteSystem {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.init();
  }

  init() {
    this.createFavoriteButtons();
    this.updateFavoriteButtons();
  }

  createFavoriteButtons() {
    const cards = document.querySelectorAll('.local-card');
    cards.forEach((card, index) => {
      if (!card.querySelector('.favorite-btn')) {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '♡';
        favoriteBtn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        `;
        
        favoriteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleFavorite(index);
        });

        card.style.position = 'relative';
        card.appendChild(favoriteBtn);
      }
    });
  }

  toggleFavorite(index) {
    const card = document.querySelectorAll('.local-card')[index];
    const placeName = card.querySelector('.local-nome').textContent;
    
    if (this.favorites.includes(index)) {
      this.favorites = this.favorites.filter(fav => fav !== index);
      notifications.show(`${placeName} removido dos favoritos`, 'info');
    } else {
      this.favorites.push(index);
      notifications.show(`${placeName} adicionado aos favoritos`, 'success');
    }

    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.updateFavoriteButtons();
  }

  updateFavoriteButtons() {
    const buttons = document.querySelectorAll('.favorite-btn');
    buttons.forEach((btn, index) => {
      if (this.favorites.includes(index)) {
        btn.innerHTML = '♥';
        btn.style.color = '#f44336';
      } else {
        btn.innerHTML = '♡';
        btn.style.color = '#666';
      }
    });
  }
}

// ===== ANIMAÇÕES SUAVES =====
class SmoothAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.addHoverEffects();
    this.addScrollToTop();
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    // Aplicar aos elementos que devem aparecer gradualmente
    const elements = document.querySelectorAll('.local-card, .flex-item, #sobre');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  addHoverEffects() {
    // Efeito hover nos cards
    const cards = document.querySelectorAll('.local-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.transition = 'transform 0.3s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Efeito hover nos botões
    const buttons = document.querySelectorAll('button:not(.favorite-btn)');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.transition = 'transform 0.2s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
    });
  }

  addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #4CAF50;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    `;

    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
      } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
      }
    });
  }
}

// ===== SISTEMA DE LOADING =====
class LoadingSystem {
  static show(element) {
    if (!element) return;
    
    element.style.position = 'relative';
    element.style.pointerEvents = 'none';
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    `;
    
    loader.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4CAF50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
    `;
    
    // Adicionar CSS para animação
    if (!document.getElementById('loading-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    element.appendChild(loader);
  }

  static hide(element) {
    if (!element) return;
    
    const loader = element.querySelector('.loading-overlay');
    if (loader) {
      loader.remove();
      element.style.pointerEvents = '';
    }
  }
}

// ===== MÁSCARA PARA TELEFONE =====
function applyPhoneMask(input) {
  input.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    e.target.value = value;
  });
}

// ===== SISTEMA DE BUSCA LOCAL =====
class LocalSearch {
  constructor() {
    this.createSearchBox();
  }

  createSearchBox() {
    const nav = document.querySelector('nav ul');
    if (nav && !document.getElementById('search-box')) {
      const searchLi = document.createElement('li');
      searchLi.innerHTML = `
        <input type="text" id="search-box" placeholder="Buscar locais..." style="
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          margin-left: 20px;
          width: 200px;
          font-size: 14px;
        ">
      `;
      nav.appendChild(searchLi);

      const searchBox = document.getElementById('search-box');
      searchBox.addEventListener('input', (e) => this.filterCards(e.target.value));
    }
  }

  filterCards(searchTerm) {
    const cards = document.querySelectorAll('.local-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
      const name = card.querySelector('.local-nome')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.local-desc')?.textContent.toLowerCase() || '';
      
      if (name.includes(term) || desc.includes(term)) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = searchTerm ? 'none' : 'block';
      }
    });

    if (searchTerm && !document.querySelector('.local-card[style*="display: block"]')) {
      notifications.show('Nenhum local encontrado para sua busca', 'info', 3000);
    }
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar sistemas baseados na página atual
  const currentPage = window.location.pathname.split('/').pop();

  // Sistemas globais
  new SmoothAnimations();

  // Sistemas específicos por página
  if (currentPage === 'contact.html') {
    new FormValidator('form');
    
    // Aplicar máscara de telefone
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
      applyPhoneMask(phoneInput);
    }
  }

  if (currentPage === 'locais.html') {
    new FavoriteSystem();
    new LocalSearch();
  }

  // Sistema de navegação suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Confirmação ao sair da página com formulário preenchido
  if (currentPage === 'contact.html') {
    let formChanged = false;
    const form = document.querySelector('form');
    
    if (form) {
      form.addEventListener('input', () => formChanged = true);
      form.addEventListener('submit', () => formChanged = false);
      
      window.addEventListener('beforeunload', (e) => {
        if (formChanged) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  }

  // Adicionar tooltips informativos
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.title && img.alt) {
      img.title = img.alt;
    }
  });

  // Mensagem de boas-vindas na primeira visita
  if (!localStorage.getItem('visited')) {
    setTimeout(() => {
      notifications.show('Bem-vindo ao Interiorzando! Explore as belezas de Jaguariúna.', 'info', 7000);
      localStorage.setItem('visited', 'true');
    }, 1000);
  }
});

// ===== UTILITÁRIOS GLOBAIS =====
window.showNotification = (message, type, duration) => {
  notifications.show(message, type, duration);
};

window.showLoading = (element) => {
  LoadingSystem.show(element);
};

window.hideLoading = (element) => {
  LoadingSystem.hide(element);
};