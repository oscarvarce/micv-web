// Fecha de última actualización
document.getElementById('last-updated').textContent = new Date(document.lastModified).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Animación de secciones
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    sections.forEach(section => observer.observe(section));
});

// Botón volver arriba
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
});

// Interruptor de tema
document.getElementById('checkbox').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
    const moon = document.querySelector('.fa-moon');
    const sun = document.querySelector('.fa-sun');
    if (this.checked) {
        moon.style.display = 'none';
        sun.style.display = 'inline';
    } else {
        moon.style.display = 'inline';
        sun.style.display = 'none';
    }
});