const preloader = document.querySelector('.preloader');
const themeToggle = document.getElementById('themeToggle');
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');

// 1. Preloader & Theme Init
window.addEventListener('load', () => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;
});

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
});

window.addEventListener('scroll', () => {
    // Header Style
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});


class InfiniteCarousel {
    constructor(trackSelector, prevBtnSelector, nextBtnSelector) {
        this.track = document.querySelector(trackSelector);
        this.slides = Array.from(this.track.children);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);
        this.currentIndex = 0;

        this.visibleSlides = window.innerWidth > 768 ? 2 : 1;
        this.setupResizeListener();
        this.updatePosition();

        this.prevBtn.addEventListener('click', () => this.moveLeft());
        this.nextBtn.addEventListener('click', () => this.moveRight());
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.visibleSlides = window.innerWidth > 768 ? 2 : 1;
            this.updatePosition();
        });
    }

    moveRight() {
        this.currentIndex++;
        if (this.currentIndex > this.slides.length - this.visibleSlides) {
            this.currentIndex = 0;
        }
        this.updatePosition();
    }

    moveLeft() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.slides.length - this.visibleSlides;
        }
        this.updatePosition();
    }

    updatePosition() {
        this.track.style.transform = `translateX(-${this.currentIndex * (100 / this.visibleSlides)}%)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.project-track')) {
        new InfiniteCarousel('.project-track', '#proj-prev', '#proj-next');
    }
    if (document.querySelector('.achieve-track')) {
        new InfiniteCarousel('.achieve-track', '#ach-prev', '#ach-next');
    }
});


// 5. 3D Card Tilt Effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;

        particlesMesh.rotation.y += mouseX * 0.05;
        particlesMesh.rotation.x += mouseY * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

window.addEventListener('load', initThreeJS);
