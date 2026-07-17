document.addEventListener('DOMContentLoaded', function() {

    // ===== PAGE LOADER =====
    const loader = document.getElementById('pageLoader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 1500);
    });
    setTimeout(function() {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 4000);

    // ===== SCROLL PROGRESS BAR =====
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // ===== CUSTOM CURSOR =====
    var cursorDot = document.getElementById('cursorDot');
    var cursorOutline = document.getElementById('cursorOutline');
    var mouseX = 0, mouseY = 0;
    var outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 4 + 'px';
        cursorDot.style.top = mouseY - 4 + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX - 18 + 'px';
        cursorOutline.style.top = outlineY - 18 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var hoverElements = document.querySelectorAll('a, button, .service-card, .work-card, .filter-btn, .testimonial-btn');
    hoverElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursorOutline.classList.add('hover');
            cursorDot.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', function() {
            cursorOutline.classList.remove('hover');
            cursorDot.style.transform = 'scale(1)';
        });
    });

    // ===== PARTICLES =====
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 20 : 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    };

    Particle.prototype.draw = function() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var r = isDark ? 0 : 108;
        var g = isDark ? 212 : 99;
        var b = isDark ? 255 : 255;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var r = isDark ? 0 : 108;
        var g = isDark ? 212 : 99;
        var b = isDark ? 255 : 255;
        for (var a = 0; a < particles.length; a++) {
            for (var b2 = a + 1; b2 < particles.length; b2++) {
                var dx = particles[a].x - particles[b2].x;
                var dy = particles[a].y - particles[b2].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (0.03 * (1 - dist / 120)) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b2].x, particles[b2].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== THEME TOGGLE (DARK/LIGHT) =====
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon = document.getElementById('themeIcon');
    var savedTheme = localStorage.getItem('arabcodes-theme') || 'light';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
        }
        localStorage.setItem('arabcodes-theme', theme);
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ===== LANGUAGE TOGGLE =====
    var langToggle = document.getElementById('langToggle');
    var langText = document.getElementById('langText');
    var html = document.documentElement;
    var currentLang = 'ar';

    langToggle.addEventListener('click', function() {
        if (currentLang === 'ar') {
            currentLang = 'en';
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            langText.textContent = 'عربي';
        } else {
            currentLang = 'ar';
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            langText.textContent = 'EN';
        }
        document.querySelectorAll('[data-ar][data-en]').forEach(function(el) {
            el.textContent = el.getAttribute('data-' + currentLang);
        });
    });

    // ===== NAVBAR SCROLL =====
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MOBILE MENU =====
    var menuToggle = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) closeMobileMenu();
    });
    document.querySelectorAll('.mobile-menu-content a').forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ===== BACK TO TOP =====
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== TYPING EFFECT =====
    var typingEl = document.getElementById('typingText');
    var typingWords = {
        ar: ['المستقبل الرقمي', 'المواقع الحديثة', 'التصاميم الإبداعية', 'التطبيقات الذكية'],
        en: ['The Digital Future', 'Modern Websites', 'Creative Designs', 'Smart Apps']
    };
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 120;

    function typeEffect() {
        var words = typingWords[currentLang] || typingWords.ar;
        var currentWord = words[wordIndex];

        if (isDeleting) {
            typingEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            typingEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 2000);

    // ===== COUNTER ANIMATION =====
    var countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        document.querySelectorAll('.stat-number[data-target]').forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-target'));
            var duration = 2000;
            var step = target / (duration / 16);
            var current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            updateCounter();
        });
    }

    // ===== WORKS FILTER =====
    var filterBtns = document.querySelectorAll('.filter-btn');
    var workCards = document.querySelectorAll('.work-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            workCards.forEach(function(card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== TESTIMONIALS SLIDER =====
    var testimonialsTrack = document.getElementById('testimonialsTrack');
    var testimonialCards = document.querySelectorAll('.testimonial-card');
    var prevBtn = document.getElementById('testimonialPrev');
    var nextBtn = document.getElementById('testimonialNext');
    var dotsContainer = document.getElementById('testimonialDots');
    var currentSlide = 0;
    var totalSlides = testimonialCards.length;
    var autoSlideInterval;

    if (dotsContainer) {
        for (var d = 0; d < totalSlides; d++) {
            var dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (d === 0 ? ' active' : '');
            dot.setAttribute('data-index', d);
            dotsContainer.appendChild(dot);
        }
    }

    var allDots = document.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        currentSlide = index;
        if (testimonialsTrack) {
            testimonialsTrack.style.transform = 'translateX(' + (currentSlide * -100) + '%)';
        }
        allDots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1);
        resetAutoSlide();
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
        resetAutoSlide();
    });
    allDots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(dot.getAttribute('data-index')));
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
        }, 5000);
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    startAutoSlide();

    // ===== SCROLL ANIMATIONS =====
    function initAnimations() {
        var animateElements = document.querySelectorAll('.service-card, .work-card, .about-feature, .about-image-wrapper, .about-content, .section-header, .hero-badge, .cta-content, .team-card');

        animateElements.forEach(function(el) {
            el.classList.add('fade-in');
        });

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    if (entry.target.classList.contains('stat')) {
                        animateCounters();
                    }

                    var statSection = entry.target.closest('.hero-stats');
                    if (statSection) {
                        animateCounters();
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(function(el) {
            observer.observe(el);
        });

        // Counter observer specifically
        var statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            var statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsSection);
        }
    }

    // ===== TILT EFFECT ON SERVICE CARDS =====
    document.querySelectorAll('[data-tilt]').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== PARALLAX ON HERO =====
    var heroVisual = document.querySelector('.hero-visual');
    var heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            if (heroVisual) heroVisual.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
            if (heroContent) heroContent.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
        }
    });

    // ===== MAGNETIC BUTTON EFFECT =====
    document.querySelectorAll('.btn-primary, .btn-whatsapp').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px) translateY(-3px)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0,0) translateY(0)';
        });
    });

});
