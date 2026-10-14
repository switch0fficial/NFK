// NFK PRIME - Main JavaScript
// Loader, animations, cursor, tilt, UI logic

(function() {
    'use strict';

    // ============================================
    // POPULATE LINKS FROM DATA (DO THIS FIRST)
    // ============================================
    try {
        if (typeof SITE !== 'undefined') {
            // Update all data-link attributes
            document.querySelectorAll('[data-link]').forEach(el => {
                const linkKey = el.getAttribute('data-link');
                if (SITE.links && SITE.links[linkKey]) {
                    el.href = SITE.links[linkKey];
                }
            });

            // Render clips
            const clipsGrid = document.getElementById('clips-grid');
            if (clipsGrid && SITE.clips && SITE.clips.length > 0) {
                clipsGrid.innerHTML = SITE.clips.map((clip, index) => `
                    <a href="${clip.url}"
                       class="clip-card"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Watch ${clip.title} on TikTok">
                        <div class="clip-thumbnail">
                            <div class="play-icon"></div>
                        </div>
                        <span class="clip-label">${clip.title}</span>
                    </a>
                `).join('');
            }

            // Show stats if populated
            if (SITE.stats) {
                const statsContainer = document.getElementById('about-stats');
                if (statsContainer) {
                    statsContainer.style.display = 'grid';

                    document.querySelectorAll('[data-stat]').forEach(el => {
                        const statKey = el.getAttribute('data-stat');
                        if (SITE.stats[statKey]) {
                            el.textContent = SITE.stats[statKey];
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error('Error populating data:', e);
    }

    // ============================================
    // LOADER
    // ============================================
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');

    // Check for repeat visits
    let skipLoader = false;
    try {
        const lastVisit = localStorage.getItem('nfk_last_visit');
        const now = Date.now();
        if (lastVisit && now - lastVisit < 30 * 60 * 1000) { // 30 minutes
            skipLoader = true;
        }
        localStorage.setItem('nfk_last_visit', now);
    } catch (e) {
        // localStorage might be disabled
    }

    function hideLoader() {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }

    if (skipLoader) {
        hideLoader();
    } else {
        // Simulate loading
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);

                if (loaderBar) loaderBar.style.width = '100%';

                setTimeout(() => {
                    if (loaderText) loaderText.textContent = 'SYSTEM ONLINE';
                    setTimeout(hideLoader, 500);
                }, 300);
            } else {
                if (loaderBar) loaderBar.style.width = progress + '%';
            }
        }, 100);
    }

    // ============================================
    // CUSTOM CURSOR (Desktop only)
    // ============================================
    const cursor = document.getElementById('cursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');

    // Only show cursor on fine pointer devices
    if (window.matchMedia('(pointer: fine)').matches && cursor) {
        cursor.classList.add('active');

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }

            if (cursorRing) {
                cursorRing.style.left = cursorX + 'px';
                cursorRing.style.top = cursorY + 'px';
            }

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .clip-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
        });
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    const taglineEl = document.getElementById('tagline');
    if (taglineEl && typeof SITE !== 'undefined' && SITE.tagline) {
        const text = SITE.tagline;
        let index = 0;

        function typeWriter() {
            if (index < text.length) {
                taglineEl.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start after loader
        setTimeout(typeWriter, skipLoader ? 500 : 2500);
    }

    // ============================================
    // TEXT SCRAMBLE EFFECT
    // ============================================
    function scrambleText(element, finalText) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const maxIterations = 10;

        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((char, i) => {
                    if (i < iterations) {
                        return finalText[i];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= finalText.length) {
                clearInterval(interval);
                element.textContent = finalText;
            }

            iterations += 1 / 2;
        }, 30);
    }

    // Apply scramble to about title
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const titleSpan = aboutTitle.querySelector('.title-gradient');
                    if (titleSpan) {
                        scrambleText(titleSpan, titleSpan.textContent);
                    }
                    observer.unobserve(aboutTitle);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(aboutTitle);
    }

    // ============================================
    // 3D TILT EFFECT (Profile Frame)
    // ============================================
    const profileFrame = document.getElementById('profile-frame');
    if (profileFrame && window.matchMedia('(pointer: fine)').matches) {
        profileFrame.addEventListener('mousemove', (e) => {
            const rect = profileFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            profileFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        profileFrame.addEventListener('mouseleave', () => {
            profileFrame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // ============================================
    // 3D TILT FOR CARDS
    // ============================================
    const clipCards = document.querySelectorAll('.clip-card');
    clipCards.forEach(card => {
        if (window.matchMedia('(pointer: fine)').matches) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu on link tap
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================
    // GSAP SCROLL ANIMATIONS (if available)
    // ============================================
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Register ScrollTrigger
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Animate sections on scroll
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate clip cards
        const clipCards = document.querySelectorAll('.clip-card');
        clipCards.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animate join cards
        const joinCards = document.querySelectorAll('.join-card');
        joinCards.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // BUTTON GLITCH EFFECT ON PRESS
    // ============================================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ============================================
    // COPY EMAIL TO CLIPBOARD
    // ============================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = copyEmailBtn.getAttribute('data-email');

            try {
                await navigator.clipboard.writeText(email);
                const copyText = copyEmailBtn.querySelector('.copy-text');
                copyText.textContent = 'Copied!';
                copyEmailBtn.classList.add('copied');

                setTimeout(() => {
                    copyText.textContent = 'Copy';
                    copyEmailBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const copyText = copyEmailBtn.querySelector('.copy-text');
                copyText.textContent = 'Copied!';
                copyEmailBtn.classList.add('copied');

                setTimeout(() => {
                    copyText.textContent = 'Copy';
                    copyEmailBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }

    console.log('NFK PRIME website loaded successfully');

})();
