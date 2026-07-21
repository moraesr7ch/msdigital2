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
    initHeaderScroll();
    initVariableProximity();
    initSpotlightCards();
    initScrollFloatAnimations();
    initCtaSequenceAnimation();
    initSquigglyText();
    initSideRays();
    initClickSpark();
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

/**
 * 08. Controle de Rolagem da Página (Sticky Capsule Header)
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  const scrollBar = document.getElementById('scroll-bar');

  const handleScroll = () => {
    // 1. Controle do Header
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 2. Controle da Barra de Scroll Lateral
    if (scrollBar) {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const totalScroll = documentHeight - windowHeight;
      const scrollPercent = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      scrollBar.style.height = `${scrollPercent}%`;
    }
  };

  // Inicializa a posição ao carregar
  handleScroll();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * 09. Gerenciamento do Pain Tabs (Abas Interativas de Dor)
 */
function selectPainTab(index) {
  const triggers = document.querySelectorAll('.pain-tab-trigger');
  const panels = document.querySelectorAll('.pain-tab-panel');

  triggers.forEach((trigger, i) => {
    if (i === index) {
      trigger.classList.add('active');
      trigger.setAttribute('aria-selected', 'true');
    } else {
      trigger.classList.remove('active');
      trigger.setAttribute('aria-selected', 'false');
    }
  });

  panels.forEach((panel, i) => {
    if (i === index) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}


/**
 * 10. Inicialização de Animações Premium com GSAP & ScrollTrigger
 */
function initGSAPAnimations() {
  if (typeof window === 'undefined' || typeof gsap === 'undefined') return;

  // Registrar Plugin de Scroll
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // A. Animação de Entrada da Hero (Sem ScrollTrigger - ao carregar)
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  heroTimeline
    .from('.hero-badge', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2
    })
    .from('.hero-content h1', {
      opacity: 0,
      y: 35,
      duration: 1.0,
    }, '-=0.6')
    .from('.hero-content p', {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, '-=0.7')
    .from('.hero-cta-group', {
      opacity: 0,
      y: 15,
      duration: 0.8,
    }, '-=0.7')
    .from('.hero-image-container', {
      opacity: 0,
      scale: 0.96,
      y: 30,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.9');

  // B. Animações de Entrada de Seção ao Rolar (ScrollTrigger)
  // 1. Cabeçalhos de Seções (.section-header)
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power2.out'
    });
  });

  // 2. Tabela de Dores
  gsap.from('.pain-tabs-container', {
    scrollTrigger: {
      trigger: '.pain-tabs-container',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 1.0,
    ease: 'power3.out'
  });

  // 3. Seção de Serviços
  gsap.from('.services-drawer-stack', {
    scrollTrigger: {
      trigger: '.services-drawer-stack',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out'
  });

  // 4. Cartões de Resultados / Métricas (Cascata / Stagger)
  const resultCards = document.querySelectorAll('.result-card');
  if (resultCards.length > 0) {
    gsap.from(resultCards, {
      scrollTrigger: {
        trigger: '.results-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  // 5. Pilares da Metodologia (Cascata / Stagger)
  const methodologyPillars = document.querySelectorAll('.methodology-pillar');
  if (methodologyPillars.length > 0) {
    gsap.from(methodologyPillars, {
      scrollTrigger: {
        trigger: '.methodology-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }
}

/**
 * 11. Inicialização do Lenis Smooth Scroll (Integrado com GSAP ScrollTrigger)
 */
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  // Inicializa o Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Integrar com o GSAP ScrollTrigger (se carregado)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Sincronizar o ScrollTrigger com o Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Dizer ao GSAP para usar o requestAnimationFrame do Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Converte para milissegundos
    });

    // Desativa suavização de lag padrão do GSAP para sincronia ideal
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback simples sem GSAP
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/**
 * 18. Efeito de Proximidade Variável (VariableProximity) no Título
 */
function prepareTextForProximity(element) {
  const letters = [];
  
  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (text.trim() === '') return;
      
      const fragment = document.createDocumentFragment();
      // 🔒 SEGURANÇA: tokenização segura usando delimitador regex sem injeção de HTML no DOM
      const tokens = text.split(/(\s+)/);
      
      tokens.forEach(token => {
        if (token.trim() === '') {
          fragment.appendChild(document.createTextNode(token));
        } else {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'vp-word';
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          
          token.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'vp-letter';
            charSpan.style.display = 'inline-block';
            charSpan.style.fontVariationSettings = "'wght' 800, 'opsz' 14"; // Valor de variação padrão em Bold (800)
            charSpan.setAttribute('aria-hidden', 'true'); // 🔒 ACESSIBILIDADE: oculta caracteres individuais de leitores de tela
            charSpan.textContent = char;
            
            wordSpan.appendChild(charSpan);
            letters.push(charSpan);
          });
          fragment.appendChild(wordSpan);
        }
      });
      
      node.parentNode.replaceChild(fragment, node);
    } else {
      // Ignora elementos de marcação e decoração para preservar layout Figma
      if (
        node.tagName === 'svg' || 
        node.classList.contains('selection-handle') || 
        node.classList.contains('selection-border') ||
        node.classList.contains('selection-cursor')
      ) {
        return;
      }
      const children = Array.from(node.childNodes);
      children.forEach(traverse);
    }
  }
  
  traverse(element);
  return letters;
}

function initVariableProximity() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  // 🔒 ACESSIBILIDADE: extrai texto limpo para leitura por leitores de tela no span oculto
  const fullText = headline.textContent.trim().replace(/\s+/g, ' ');

  // Definições de eixos e limites de variação (from: wght 800, opsz 14 -> to: wght 1000, opsz 40)
  const fromFontVariationSettings = "'wght' 800, 'opsz' 14";
  const toFontVariationSettings = "'wght' 1000, 'opsz' 40";
  const radius = 120;
  const falloff = 'exponential';

  const parseSettings = (settingsStr) => {
    const map = new Map();
    settingsStr.split(',').forEach(s => {
      const parts = s.trim().split(/\s+/);
      if (parts.length === 2) {
        const name = parts[0].replace(/['"]/g, '');
        const value = parseFloat(parts[1]);
        map.set(name, value);
      }
    });
    return map;
  };

  const fromSettings = parseSettings(fromFontVariationSettings);
  const toSettings = parseSettings(toFontVariationSettings);

  const parsedSettings = Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: toSettings.has(axis) ? toSettings.get(axis) : fromValue
  }));

  const letters = prepareTextForProximity(headline);
  if (letters.length === 0) return;

  headline.classList.add('variable-proximity');

  // 🔒 ACESSIBILIDADE: insere span invisível legível por leitores de tela
  const srOnlySpan = document.createElement('span');
  srOnlySpan.className = 'sr-only';
  srOnlySpan.textContent = fullText;
  headline.appendChild(srOnlySpan);

  let mouseX = null;
  let mouseY = null;
  let active = false;

  const updatePosition = (clientX, clientY) => {
    mouseX = clientX;
    mouseY = clientY;
    active = true;
  };

  const handleMouseMove = (e) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    active = false;
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    if (falloff === 'exponential') {
      return norm ** 2;
    } else if (falloff === 'gaussian') {
      return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
    } else {
      return norm; // linear
    }
  };

  let lastX = null;
  let lastY = null;

  const loop = () => {
    requestAnimationFrame(loop);

    if (!active) {
      if (lastX === null && lastY === null) return;
      letters.forEach(letter => {
        letter.style.fontVariationSettings = fromFontVariationSettings;
      });
      lastX = null;
      lastY = null;
      return;
    }

    if (lastX === mouseX && lastY === mouseY) return;
    lastX = mouseX;
    lastY = mouseY;

    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      // 🔒 PERFORMANCE: usa posições absolutas na viewport para evitar recálculo de BoundingRect do container
      const letterCenterX = rect.left + rect.width / 2;
      const letterCenterY = rect.top + rect.height / 2;

      const distance = calculateDistance(mouseX, mouseY, letterCenterX, letterCenterY);

      if (distance >= radius) {
        letter.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      letter.style.fontVariationSettings = newSettings;
    });
  };

  requestAnimationFrame(loop);
}

/**
 * 19. Efeito SpotlightCard (Iluminação Dinâmica nos Cards)
 */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.card-spotlight, .pillar-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });
}

/**
 * 20. Efeito ScrollFloat (Animação de Texto Flutuante com GSAP ScrollTrigger)
 */
function initScrollFloatAnimations() {
  if (typeof window === 'undefined' || typeof gsap === 'undefined') return;

  const elements = document.querySelectorAll('.scroll-float');
  if (elements.length === 0) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  elements.forEach(element => {
    if (element.classList.contains('scroll-float-initialized')) return;
    element.classList.add('scroll-float-initialized');

    const fullText = element.textContent.trim().replace(/\s+/g, ' ');

    // 🔒 ACESSIBILIDADE & SEO: cria span invisível legível por leitores de tela
    const srOnlySpan = document.createElement('span');
    srOnlySpan.className = 'sr-only';
    srOnlySpan.textContent = fullText;

    const fragment = document.createDocumentFragment();
    const tokens = fullText.split(/(\s+)/);
    const charElements = [];

    tokens.forEach(token => {
      if (token.trim() === '') {
        fragment.appendChild(document.createTextNode(token));
      } else {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'scroll-float-word';

        token.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.setAttribute('aria-hidden', 'true');
          charSpan.textContent = char;

          wordSpan.appendChild(charSpan);
          charElements.push(charSpan);
        });
        fragment.appendChild(wordSpan);
      }
    });

    element.innerHTML = '';
    element.appendChild(fragment);
    element.appendChild(srOnlySpan);

    // Animação GSAP ScrollFloat
    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: 50,
        ease: 'back.inOut(2)',
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: element,
          scroller: window,
          start: 'top bottom-=5%',
          end: 'bottom center+=20%',
          scrub: 1
        }
      }
    );
  });
}

/**
 * 21. Animação de Scroll Fixado por Etapas na Seção CTA Final (#contato)
 * Etapa 1: Apenas Título -> Etapa 2: Apenas Parágrafo -> Etapa 3: Apenas Botão CTA
 */
function initCtaSequenceAnimation() {
  if (typeof window === 'undefined' || typeof gsap === 'undefined') return;

  const ctaSection = document.querySelector('.cta-final-section');
  const ctaStep1 = document.querySelector('.cta-step-1');
  const ctaStep2 = document.querySelector('.cta-step-2');
  const ctaStep3 = document.querySelector('.cta-step-3');

  if (!ctaSection || !ctaStep1 || !ctaStep2 || !ctaStep3) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Define os estados iniciais (Apenas Etapa 1 visível)
  gsap.set(ctaStep1, { opacity: 1, y: 0, scale: 1 });
  gsap.set(ctaStep2, { opacity: 0, y: 50, scale: 0.95 });
  gsap.set(ctaStep3, { opacity: 0, y: 50, scale: 0.95 });

  // Timeline GSAP ScrollTrigger amarrada ao Scroll (Pinned)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ctaSection,
      start: 'top top',
      end: '+=200%', // Duração de 200vh de rolagem da tela
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Etapa 1 -> Etapa 2: Título sobe e desaparece, Parágrafo entra no centro
  tl.to(ctaStep1, { opacity: 0, y: -50, scale: 0.95, duration: 1 })
    .to(ctaStep2, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.5')

  // Etapa 2 -> Etapa 3: Parágrafo sobe e desaparece, Botão CTA entra no centro
    .to(ctaStep2, { opacity: 0, y: -50, scale: 0.95, duration: 1 })
    .to(ctaStep3, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.5');
}

/**
 * 22. Efeito SquigglyText (Texto Ondulado Vibrante via Filtros SVG)
 */
function initSquigglyText() {
  const elements = document.querySelectorAll('.squiggly-text');
  if (elements.length === 0) return;

  const steps = 5;
  const stepDuration = 80; // Troca de filtro a cada 80ms para efeito fluido
  let currentStep = 0;

  setInterval(() => {
    currentStep = (currentStep + 1) % steps;
    const filterUrl = `url(#squiggly-${currentStep})`;

    elements.forEach(el => {
      el.style.filter = filterUrl;
    });
  }, stepDuration);
}

/**
 * 23. Efeito SideRays (Feixes de Luz WebGL no Fundo da Seção CTA Final EXCLUSIVAMENTE)
 */
function initSideRays() {
  const container = document.getElementById('cta-side-rays');
  if (!container) return;

  const config = {
    speed: 2.0,
    rayColor1: '#F5A623', // Laranja Ouro MS Digital
    rayColor2: '#4774D2', // Azul MS Digital
    intensity: 2.0,
    spread: 2.0,
    origin: 'top-right',
    tilt: 0,
    saturation: 1.5,
    blend: 0.75,
    falloff: 1.6,
    opacity: 0.85
  };

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };

  const originToFlip = (origin) => {
    switch (origin) {
      case 'top-left': return [1, 0];
      case 'bottom-right': return [0, 1];
      case 'bottom-left': return [1, 1];
      default: return [0, 0]; // top-right
    }
  };

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  container.appendChild(canvas);

  const vertShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragShaderSource = `
    precision highp float;

    uniform float iTime;
    uniform vec2 iResolution;
    uniform float iSpeed;
    uniform vec3 iRayColor1;
    uniform vec3 iRayColor2;
    uniform float iIntensity;
    uniform float iSpread;
    uniform float iFlipX;
    uniform float iFlipY;
    uniform float iTilt;
    uniform float iSaturation;
    uniform float iBlend;
    uniform float iFalloff;
    uniform float iOpacity;

    float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
      vec2 sourceToCoord = coord - raySource;
      float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
      return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
        0.0, 1.0) *
        clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
      if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

      vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
      vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

      float tiltRad = iTilt * 3.14159265 / 180.0;
      float cs = cos(tiltRad);
      float sn = sin(tiltRad);
      vec2 rel = coord - rayPos;
      vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

      float halfSpread = iSpread * 0.275;
      vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
      vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

      vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
      vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

      vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

      float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
      float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
      color.rgb *= brightness;

      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(gray), color.rgb, iSaturation);

      color.a = max(color.r, max(color.g, color.b)) * iOpacity;
      gl_FragColor = color;
    }
  `;

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
  if (!vertShader || !fragShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'iTime');
  const uResolution = gl.getUniformLocation(program, 'iResolution');
  const uSpeed = gl.getUniformLocation(program, 'iSpeed');
  const uRayColor1 = gl.getUniformLocation(program, 'iRayColor1');
  const uRayColor2 = gl.getUniformLocation(program, 'iRayColor2');
  const uIntensity = gl.getUniformLocation(program, 'iIntensity');
  const uSpread = gl.getUniformLocation(program, 'iSpread');
  const uFlipX = gl.getUniformLocation(program, 'iFlipX');
  const uFlipY = gl.getUniformLocation(program, 'iFlipY');
  const uTilt = gl.getUniformLocation(program, 'iTilt');
  const uSaturation = gl.getUniformLocation(program, 'iSaturation');
  const uBlend = gl.getUniformLocation(program, 'iBlend');
  const uFalloff = gl.getUniformLocation(program, 'iFalloff');
  const uOpacity = gl.getUniformLocation(program, 'iOpacity');

  const [flipX, flipY] = originToFlip(config.origin);

  gl.uniform1f(uSpeed, config.speed);
  gl.uniform3fv(uRayColor1, hexToRgb(config.rayColor1));
  gl.uniform3fv(uRayColor2, hexToRgb(config.rayColor2));
  gl.uniform1f(uIntensity, config.intensity);
  gl.uniform1f(uSpread, config.spread);
  gl.uniform1f(uFlipX, flipX);
  gl.uniform1f(uFlipY, flipY);
  gl.uniform1f(uTilt, config.tilt);
  gl.uniform1f(uSaturation, config.saturation);
  gl.uniform1f(uBlend, config.blend);
  gl.uniform1f(uFalloff, config.falloff);
  gl.uniform1f(uOpacity, config.opacity);

  let animFrameId = null;
  let isVisible = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }
  };

  const render = (time) => {
    if (!isVisible) return;
    resize();
    gl.uniform1f(uTime, time * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animFrameId = requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize);

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    isVisible = entry.isIntersecting;
    if (isVisible) {
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(render);
      }
    } else {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  }, { threshold: 0.05 });

  observer.observe(container);
}

/**
 * 24. Efeito ClickSpark Global (Faíscas Dinâmicas de Alta Performance ao Clicar no Site)
 */
function initClickSpark() {
  const canvas = document.createElement('canvas');
  canvas.id = 'click-spark-canvas';
  canvas.style.cssText = 'position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 99999; display: block;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let sparks = [];
  let animId = null;

  const sparkSize = 14;   // Comprimento inicial de cada faísca
  const sparkRadius = 28; // Distância total do centro do clique
  const sparkCount = 8;   // Número de faíscas radiantes por clique
  const duration = 450;   // Duração da animação em milissegundos

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };

  window.addEventListener('resize', resize);
  resize();

  const easeOut = (t) => t * (2 - t);

  const draw = (timestamp) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    sparks = sparks.filter(spark => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easeOut(progress);

      const distance = eased * sparkRadius;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.save();
      ctx.strokeStyle = spark.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();

      return true;
    });

    if (sparks.length > 0) {
      animId = requestAnimationFrame(draw);
    } else {
      animId = null;
    }
  };

  window.addEventListener('pointerdown', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    // Paleta harmônica da MS Digital: Azul MS, Laranja Ouro e Azul Claro
    const colors = ['#4774D2', '#F5A623', '#60A5FA'];

    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        color: colors[i % colors.length]
      });
    }

    if (!animId) {
      animId = requestAnimationFrame(draw);
    }
  }, { passive: true });
}

// Inicializar tudo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  initLenisSmoothScroll();
  initGSAPAnimations();
});

// Exportações para fins de Teste Node.js (TDD de Segurança)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sanitizeInput,
    validateEmail,
    validatePhone
  };
}

