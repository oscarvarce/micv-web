// Efecto de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cambiar color del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.opacity = 1 - window.scrollY / 500;
});