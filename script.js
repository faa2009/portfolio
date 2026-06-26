/**
 * Arsitektur Kode Portofolio Raffa - 2026
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SIKLUS PRELOADER DENGAN LOADING BAR REALISTIS ---
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.querySelector('.preloader-bar');

    setTimeout(() => {
        if(preloaderBar) preloaderBar.style.width = '100%';
    }, 100);

    window.addEventListener('load', () => {
        setTimeout(() => {
            if(preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
            jalankanAnimasiSelamatDatang();
        }, 1600);
    });

    // --- 2. FRAMEWORK WELCOME ANIMATION HERO ---
    function jalankanAnimasiSelamatDatang() {
        const navbar = document.querySelector('.navbar');
        const sequentialItems = document.querySelectorAll('.seq-item');

        if(navbar) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
            navbar.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease';
        }

        sequentialItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }, index * 150);
        });
    }

    // --- 3. AKSELERASI KURSOR KUSTOM (KHUSUS DESKTOP) ---
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor && window.innerWidth > 992) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        document.body.addEventListener('mouseenter', (e) => {
            if(e.target.classList && e.target.classList.contains('hover-target')) {
                cursor.classList.add('grow');
            }
        }, true);

        document.body.addEventListener('mouseleave', (e) => {
            if(e.target.classList && e.target.classList.contains('hover-target')) {
                cursor.classList.remove('grow');
            }
        }, true);
    }

    // --- 4. ENGINE INTERAKSI MOUSE TILT & PARALLAX DEPTH 3D (60 FPS SUPER SMOOTH) ---
    const workspace = document.getElementById('workspace3D');
    const layers = document.querySelectorAll('.layer');

    let mouseX = 0, mouseY = 0;      
    let currentX = 0, currentY = 0;  

    if (workspace && window.innerWidth > 992) {
        window.addEventListener('mousemove', (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            
            // Ubah rasio jangkauan gerak agar pergeseran foto presisi di kisaran 6-8px
            mouseX = (e.clientX - cx) / cx;
            mouseY = (e.clientY - cy) / cy;
        });

        function render3DWorkspace() {
            // Menggunakan factor 0.05 untuk efek pelambatan lambat yang jauh lebih elegan (Premium Feel)
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            const rotateX = currentY * -10; 
            const rotateY = currentX * 10;  
            workspace.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            layers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
                
                // Pergeseran posisi koordinat parallax independen
                const moveX = currentX * (depth * 30); 
                const moveY = currentY * (depth * 30);
                const translateZ = depth * 50;

                // Terapkan translasi murni tanpa mengganggu class hover di dalam CSS
                layer.style.transform = `translateX(${moveX}px) translateY(${moveY}px) translateZ(${translateZ}px)`;
            });

            requestAnimationFrame(render3DWorkspace);
        }
        
        requestAnimationFrame(render3DWorkspace);
    }

    // --- 5. PARALLAX EFFECT SAAT WEB DI-SCROLL ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (workspace && scrolled < window.innerHeight) {
            // Geser sedikit posisi workspace vertikal untuk kedalaman scroll parallax
            workspace.style.top = `${scrolled * 0.08}px`;
        }
    });

    // --- 6. ENGINE SEARCH & FILTER KATEGORI PROYEK DINAMIS ---
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    function sinkronisasiTampilanProyek() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const currentActiveFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        projectItems.forEach(item => {
            const projectTitle = item.getAttribute('data-title').toLowerCase();
            const projectCategory = item.getAttribute('data-category');

            const matchSearch = projectTitle.includes(query);
            const matchFilter = (currentActiveFilter === 'all') || (projectCategory === currentActiveFilter);

            if (matchSearch && matchFilter) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    if(searchInput) {
        searchInput.addEventListener('input', sinkronisasiTampilanProyek);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            sinkronisasiTampilanProyek();
        });
    });

    // --- 7. INTERSECTION OBSERVER UNTUK ANIMASI SCROLL REVEAL ---
    const scrollAnimatedElements = document.querySelectorAll('.scroll-anim');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                if(entry.target.id === 'timeline') {
                    const line = entry.target.querySelector('.timeline-line');
                    if(line) line.style.height = '100%';
                }

                const progressFills = entry.target.querySelectorAll('.progress-fill');
                if(progressFills.length > 0) {
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-progress');
                        fill.style.width = targetWidth;
                    });
                }
                
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    scrollAnimatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

});