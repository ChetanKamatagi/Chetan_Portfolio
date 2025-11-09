
(function () {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme');

    function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (theme === 'light') {
        // Light Mode Colors
        document.documentElement.style.setProperty('--bg', '#f7f8fb');
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--surface-2', '#f3f5fa');
        document.documentElement.style.setProperty('--text', '#0c1322');
        document.documentElement.style.setProperty('--muted', '#5b6575');
        document.documentElement.style.setProperty('--shadow', '0 20px 40px rgba(10,20,40,.08)');
        document.documentElement.style.setProperty('--ring', 'rgba(124,92,255,.15)');
    } else {
        // Dark Mode Colors
        document.documentElement.style.setProperty('--bg', '#0b0f1a');
        document.documentElement.style.setProperty('--surface', '#101624');
        document.documentElement.style.setProperty('--surface-2', '#121a2b');
        document.documentElement.style.setProperty('--text', '#e6e9ef');
        document.documentElement.style.setProperty('--muted', '#9aa3b2');
        document.documentElement.style.setProperty('--shadow', '0 20px 40px rgba(0,0,0,.35)');
        document.documentElement.style.setProperty('--ring', 'rgba(124,92,255,.35)');
    }
    }

    // Default to 'light' theme
    applyTheme(saved || 'dark');

    toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
    });
})();


// Fade-in animations on scroll
(function () {
    const observerOptions = {
    threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        const targetElement = entry.target;
        targetElement.classList.add('is-visible');

        // Stagger children with a delay
        const children = targetElement.querySelectorAll(':scope > *:not(.is-visible)');
        children.forEach((child, index) => {
            child.style.setProperty('--delay', `${index * 100}ms`);
            child.classList.add('is-visible'); 
        });

        observer.unobserve(targetElement); 
        }
    });
    }, observerOptions);

    // Observe all top-level .fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
    });

    // Stagger card animations
    document.querySelectorAll('.card-grid, .grid').forEach(grid => {
    const gridObserver = new IntersectionObserver((entries, gridObserver) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((card, index) => {
            card.style.setProperty('--delay', `${index * 100}ms`);
            card.classList.add('fade-in');
            card.classList.add('is-visible'); 
            });
            gridObserver.unobserve(entry.target);
        }
        });
    }, observerOptions);
    gridObserver.observe(grid);
    });

})();

