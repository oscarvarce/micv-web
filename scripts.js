/**
 * =============================================
 * FUNCIONALIDADES PRINCIPALES DEL PORTFOLIO
 * =============================================
 */

// Configuración global
const config = {
    scrollOffset: 200,    // Offset para detección de secciones
    headerFadeStart: 500, // Píxeles donde comienza el fade del header
    passiveEvents: true   // Usar event listeners pasivos para performance
};

/**
 * ======================
 * FUNCIONES DE SCROLL
 * ======================
 */

/**
 * Inicializa el scroll suave para todos los enlaces internos
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

/**
 * Maneja el evento de scroll suave
 * @param {Event} e - Evento de click
 */
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        updateActiveNav(this);
    }
}

/**
 * ======================
 * EFECTOS VISUALES
 * ======================
 */

/**
 * Efecto de fade en el header al hacer scroll
 */
function setupHeaderFade() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            const opacity = 1 - Math.min(window.scrollY / config.headerFadeStart, 0.3);
            header.style.opacity = opacity;
            header.style.willChange = 'opacity'; // Optimización para el navegador
        }
    }, { passive: config.passiveEvents });
}

/**
 * ======================
 * NAVEGACIÓN ACTIVA (MEJORADA CON INTERSECTION OBSERVER)
 * ======================
 */

/**
 * Configura el observador de intersección para las secciones
 */
function setupSectionObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-menu a');
    
    // Opciones del observador
    const observerOptions = {
        root: null,
        rootMargin: `-${window.innerHeight / 2}px 0px`,
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveNav(null, sectionId);
            }
        });
    }, observerOptions);
    
    // Observar cada sección
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Manejar clicks manualmente
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // El scroll suave ya se maneja en handleSmoothScroll
            updateActiveNav(this);
        });
    });
}

/**
 * Actualiza el enlace activo en la navegación
 * @param {HTMLElement} clickedLink - Enlace clickeado (opcional)
 * @param {string} sectionId - ID de la sección activa (opcional)
 */
function updateActiveNav(clickedLink = null, sectionId = '') {
    const navLinks = document.querySelectorAll('.main-menu a');
    let foundActive = false;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Prioridad al enlace clickeado
        if (clickedLink && link === clickedLink) {
            link.classList.add('active');
            foundActive = true;
        } 
        // O detectar por sección visible
        else if (sectionId && link.getAttribute('href') === `#${sectionId}` && !foundActive) {
            link.classList.add('active');
        }
    });
}

/**
 * ======================
 * UTILIDADES
 * ======================
 */

/**
 * Limita la frecuencia de ejecución de una función (para scroll legacy)
 * @param {Function} func - Función a limitar
 * @param {number} limit - Tiempo en ms
 * @return {Function} - Función limitada
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * ======================
 * INICIALIZACIÓN
 * ======================
 */

// Inicializa todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    setupHeaderFade();
    
    // Usar Intersection Observer si está disponible, sino fallback al método tradicional
    if ('IntersectionObserver' in window) {
        setupSectionObserver();
    } else {
        // Fallback para navegadores antiguos
        window.addEventListener('scroll', throttle(() => {
            const sections = document.querySelectorAll('section');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - config.scrollOffset)) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            updateActiveNav(null, currentSection);
        }, 100), { passive: config.passiveEvents });
    }
    
    // Establece la sección inicial como activa
    updateActiveNav(null, 'about');
});

// Polyfill opcional para IntersectionObserver
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver no soportado, cargando polyfill...');
    // Aquí podrías cargar dinámicamente un polyfill si lo deseas
    // Ej: document.write('<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"><\/script>');
}