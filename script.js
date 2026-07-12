/**
 * MS Digital - Scripts de Interatividade e Segurança
 * Desenvolvido seguindo as regras de funções puras, semântica e segurança Zero-Trust
 */

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Inicialização das interações
    initMobileMenu();
    initTestimonialsCarousel();
    initExclusiveFaq();
    initFormValidation();
    initNewsletterValidation();
    initCounterAnimation();
    initHeroParticles();
    initScrollReveal();
    initDrawerStack();
  });
}

/**
 * 01. Gerenciamento do Menu Mobile
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  // Abre e fecha o menu
  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    });
  });

  // Fecha o menu se o usuário clicar fora dele
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !toggleBtn.contains(e.target)) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    }
  });
}

/**
 * 02. Carrossel de Depoimentos Acessível
 */
function initTestimonialsCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');

  if (cards.length === 0) return;

  let currentIndex = 0;

  function showTestimonial(index) {
    // Normalização do index (circula se ultrapassar limites)
    if (index >= cards.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = cards.length - 1;
    } else {
      currentIndex = index;
    }

    // Atualiza visibilidade dos cards
    cards.forEach((card, i) => {
      if (i === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Atualiza indicadores visuais
    indicators.forEach((indicator, i) => {
      if (i === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Eventos de clique nos controles
  prevBtn?.addEventListener('click', () => showTestimonial(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showTestimonial(currentIndex + 1));

  // Eventos de clique nos indicadores
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const targetIndex = parseInt(indicator.getAttribute('data-index') || '0', 10);
      showTestimonial(targetIndex);
    });
  });

  // Transição automática suave a cada 8 segundos
  let autoSlide = setInterval(() => {
    showTestimonial(currentIndex + 1);
  }, 8000);

  // Pausa a transição automática quando o mouse está sobre o carrossel (UX)
  const wrapper = document.querySelector('.testimonials-carousel-wrapper');
  wrapper?.addEventListener('mouseenter', () => clearInterval(autoSlide));
  wrapper?.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      showTestimonial(currentIndex + 1);
    }, 8000);
  });
}

/**
 * 03. FAQ - Sanfona de comportamento exclusivo
 * Garante que apenas um <details> fique aberto por vez
 */
function initExclusiveFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Como o evento de clique acontece antes do atributo "open" mudar no DOM,
      // nós aguardamos a mudança ou verificamos o estado.
      const summary = item.querySelector('summary');
      if (e.target === summary || summary?.contains(e.target)) {
        // Se este card está prestes a abrir
        if (!item.hasAttribute('open')) {
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.removeAttribute('open');
            }
          });
        }
      }
    });
  });
}

/**
 * Funções Utilitárias de Segurança e Validação (Escopo Global)
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

function initCounterAnimation() {
  const numbers = document.querySelectorAll('.proof-number');
  if (numbers.length === 0) return;

  numbers.forEach(num => {
    const originalText = num.textContent.trim();
    const targetValue = parseInt(originalText.replace(/\D/g, ''), 10);
    if (isNaN(targetValue)) return;

    const hasPlus = originalText.startsWith('+');
    const hasPercent = originalText.endsWith('%');
    const hasX = originalText.endsWith('x');

    const duration = 1800; // 1.8 segundos
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing Out Cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(ease * targetValue);

      let displayText = currentValue;
      if (hasPlus) displayText = `+${currentValue}`;
      if (hasPercent) displayText = `${currentValue}%`;
      if (hasX) displayText = `${currentValue}x`;

      num.textContent = displayText;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        num.textContent = originalText;
      }
    }

    // Inicializa zerado para a animação começar do zero
    let initialText = '0';
    if (hasPlus) initialText = '+0';
    if (hasPercent) initialText = '0%';
    if (hasX) initialText = '0x';
    num.textContent = initialText;

    // Dispara apenas quando o elemento entra na tela
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(num);
    } else {
      // Fallback imediato se não houver suporte a IntersectionObserver
      requestAnimationFrame(animate);
    }
  });
}

function initHeroParticles() {
  const heroSection = document.getElementById('home');
  const canvas = document.getElementById('hero-particles-canvas');
  if (!heroSection || !canvas) return;

  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = heroSection.offsetWidth;
  let height = canvas.height = heroSection.offsetHeight;

  const particles = [];
  const spacing = 20; // Espaçamento entre os quadradinhos em pixels

  const mouse = {
    x: null,
    y: null
  };

  class GridDot {
    constructor(baseX, baseY) {
      this.baseX = baseX;
      this.baseY = baseY;
      this.x = baseX;
      this.y = baseY;
      this.vx = 0;
      this.vy = 0;
      this.size = 3.5; // Tamanho do quadradinho em pixels
      
      // Propriedades físicas da mola (sensação de tecido elástico)
      this.spring = 0.045;
      this.friction = 0.88;
      
      // Opacidade base e oscilação
      this.baseAlpha = 0.12; // Suave para não competir com os textos
      this.alpha = this.baseAlpha;
      
      // Atraso de fase para a onda luminosa baseado na sua posição
      this.waveOffset = (this.baseX + this.baseY) * 0.005;
    }

    update(time) {
      // 1. Onda sutil de brilho cruzando diagonalmente
      const wave = Math.sin(time * 0.002 + this.waveOffset);
      let targetAlpha = this.baseAlpha + (wave + 1) * 0.06; // Flutua suavemente

      // Posição alvo (sua âncora original)
      const targetX = this.baseX;
      const targetY = this.baseY;

      // 2. Interação magnética elástica com o mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        const activeRadius = 130;

        if (distance < activeRadius) {
          const force = (activeRadius - distance) / activeRadius;
          
          // Empurrão físico elástico leve (afastamento sutil de até ~8px)
          this.vx -= (dx / distance) * force * 0.85;
          this.vy -= (dy / distance) * force * 0.85;
          
          // Brilho iluminado de acordo com a proximidade do cursor
          targetAlpha += force * 0.5;
        }
      }

      // 3. Força elástica de retorno (mola)
      const dxTarget = targetX - this.x;
      const dyTarget = targetY - this.y;
      
      this.vx += dxTarget * this.spring;
      this.vy += dyTarget * this.spring;
      
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.x += this.vx;
      this.y += this.vy;

      // Suaviza a transição da opacidade
      this.alpha += (targetAlpha - this.alpha) * 0.1;
    }

    draw() {
      // Tom cinza neutro (Zinc-400) com opacidade dinâmica
      ctx.fillStyle = `rgba(161, 161, 170, ${this.alpha})`;
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }

  function createParticles() {
    particles.length = 0;
    
    // Oculta e não cria quadradinhos em telas pequenas para evitar sobreposição nos textos
    if (window.innerWidth < 992) {
      return;
    }

    // Grade Esquerda: Ocupa de 3% a 20% da largura, e de 15% a 85% da altura
    const leftMinX = Math.round(width * 0.03);
    const leftMaxX = Math.round(width * 0.20);
    const leftMinY = Math.round(height * 0.15);
    const leftMaxY = Math.round(height * 0.85);

    // Grade Direita: Ocupa de 80% a 97% da largura, e de 15% a 85% da altura
    const rightMinX = Math.round(width * 0.80);
    const rightMaxX = Math.round(width * 0.97);
    const rightMinY = Math.round(height * 0.15);
    const rightMaxY = Math.round(height * 0.85);

    // Preenche lateral esquerda
    for (let px = leftMinX; px <= leftMaxX; px += spacing) {
      for (let py = leftMinY; py <= leftMaxY; py += spacing) {
        particles.push(new GridDot(px, py));
      }
    }

    // Preenche lateral direita
    for (let px = rightMinX; px <= rightMaxX; px += spacing) {
      for (let py = rightMinY; py <= rightMaxY; py += spacing) {
        particles.push(new GridDot(px, py));
      }
    }
  }

  // Monitora redimensionamento
  window.addEventListener('resize', () => {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    createParticles();
  });

  // Eventos do mouse
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let lastTime = 0;
  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update(timestamp);
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  createParticles();
  requestAnimationFrame(animate);
}

/**
 * 04. Validação Segura e Sanitização de Entradas (Formulário de Proposta)
 * Alinhado com as diretrizes do AppSec Sênior (Zero-Trust / Defesa em Profundidade)
 */
function initFormValidation() {
  const form = document.getElementById('proposta-form');
  const feedbackBox = document.getElementById('form-feedback');

  if (!form || !feedbackBox) return;

  // Validação em tempo real dos campos
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid-field')) {
        validateField(input);
      }
    });
  });

  // Máscara básica para WhatsApp (Telefone)
  const phoneInput = document.getElementById('form-phone');
  phoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (value.length > 11) value = value.slice(0, 11);

    // Formata o número (XX) XXXXX-XXXX
    if (value.length > 6) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      e.target.value = `(${value}`;
    } else {
      e.target.value = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) {
      showFeedback('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
      return;
    }

    // Coleta dos dados sanitizados
    const formData = {
      name: sanitizeInput(document.getElementById('form-name')?.value),
      email: sanitizeInput(document.getElementById('form-email')?.value),
      phone: sanitizeInput(document.getElementById('form-phone')?.value),
      service: sanitizeInput(document.getElementById('form-service')?.value),
      message: sanitizeInput(document.getElementById('form-message')?.value || '')
    };

    // Simulação segura de envio (Proteção Zero-Trust - sem vazar dados de endpoints no JS público)
    showFeedback('Enviando solicitação...', 'success');

    // Desabilita botões para evitar duplo clique (Race Conditions / DoS de envio)
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      // Sucesso na simulação
      showFeedback('Sua proposta foi solicitada com sucesso! Nossa equipe entrará em contato em até 24 horas.', 'success');
      form.reset();

      if (submitBtn) submitBtn.disabled = false;

      // Some com a mensagem de feedback após 8 segundos
      setTimeout(() => {
        feedbackBox.style.display = 'none';
      }, 8000);
    }, 1500);
  });

  function validateField(input) {
    const errorId = `error-${input.id.replace('form-', '')}`;
    const errorSpan = document.getElementById(errorId);
    let isValid = true;
    let errorMsg = '';

    // Verifica obrigatoriedade
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMsg = 'Este campo é de preenchimento obrigatório.';
    } else if (input.id === 'form-email' && input.value) {
      if (!validateEmail(input.value)) {
        isValid = false;
        errorMsg = 'Insira um endereço de e-mail válido.';
      }
    } else if (input.id === 'form-phone' && input.value) {
      if (!validatePhone(input.value)) {
        isValid = false;
        errorMsg = 'Insira um número de WhatsApp com DDD válido.';
      }
    }

    // Exibe ou oculta erros de forma acessível
    if (!isValid) {
      input.classList.add('invalid-field');
      input.setAttribute('aria-invalid', 'true');
      if (errorSpan) {
        errorSpan.textContent = errorMsg;
        errorSpan.style.display = 'block';
      }
    } else {
      input.classList.remove('invalid-field');
      input.removeAttribute('aria-invalid');
      if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
      }
    }

    return isValid;
  }

  function showFeedback(message, type) {
    feedbackBox.textContent = message;
    feedbackBox.className = `form-feedback-box ${type}`;
    feedbackBox.style.display = 'block';
  }
}

/**
 * 05. Validação do Formulário de Newsletter
 */
function initNewsletterValidation() {
  const form = document.getElementById('newsletter-form');
  const feedbackSpan = document.getElementById('newsletter-feedback');

  if (!form || !feedbackSpan) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('newsletter-email');
    const errorSpan = document.getElementById('error-news-email');

    if (!emailInput) return;

    const emailValue = emailInput.value.trim();

    if (!emailValue) {
      showError('Por favor, preencha o e-mail.');
      return;
    }

    if (!validateEmail(emailValue)) {
      showError('Endereço de e-mail inválido.');
      return;
    }

    // Limpa erros anteriores
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }

    const sanitizedEmail = sanitizeInput(emailValue);

    // Simulação de envio da Newsletter
    feedbackSpan.textContent = 'Inscrevendo...';
    feedbackSpan.className = 'newsletter-feedback';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      feedbackSpan.textContent = 'Inscrição realizada com sucesso!';
      feedbackSpan.className = 'newsletter-feedback success';
      emailInput.value = '';
      if (submitBtn) submitBtn.disabled = false;

      setTimeout(() => {
        feedbackSpan.textContent = '';
      }, 5000);
    }, 1200);
  });

  function showError(msg) {
    const errorSpan = document.getElementById('error-news-email');
    if (errorSpan) {
      errorSpan.textContent = msg;
      errorSpan.style.display = 'block';
    }
    feedbackSpan.textContent = '';
  }
}


/**
 * 06. Scroll Reveal para os Cards de Pilares (Bidirecional e Stagger Independente)
 */
function initScrollReveal() {
  const cards = document.querySelectorAll('.solution-pillars .pillar-card');
  
  if (cards.length === 0) return;

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Remove ao sair da tela para poder re-animar no scroll inverso
          entry.target.classList.remove('visible');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px" // Dispara um pouco antes de entrar totalmente na tela
    });

    cards.forEach(card => observer.observe(card));
  } else {
    // Fallback se não houver suporte
    cards.forEach(card => card.classList.add('visible'));
  }
}

/**
 * 07. Gerenciamento do Drawer Stack (Gaveta de Serviços)
 */
function initDrawerStack() {
  const cards = document.querySelectorAll('.drawer-card');
  if (cards.length === 0) return;

  // Inicializa o primeiro card como ativo
  selectDrawerCard(0);
}

function selectDrawerCard(index) {
  const cards = document.querySelectorAll('.drawer-card');
  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    if (i === index) {
      card.classList.add('active');
      card.style.setProperty('--y-pos', '150px');
      card.style.setProperty('--z-index', '40');
      card.style.setProperty('--scale', '1');
    } else {
      card.classList.remove('active');
      // Calcula a posição na pilha baseando-se no índice em relação ao ativo
      const order = i < index ? i : i - 1;
      card.style.setProperty('--y-pos', `${order * 50}px`);
      card.style.setProperty('--z-index', `${10 + order * 10}`);
      // Escalas dinâmicas em perspectiva de profundidade [atrás, meio, frente]
      const scales = [0.91, 0.95, 0.98];
      card.style.setProperty('--scale', scales[order]);
    }
  });
}


// Exportações para fins de Teste Node.js (TDD de Segurança)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeInput,
    validateEmail,
    validatePhone
  };
}

