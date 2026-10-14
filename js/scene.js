// NFK PRIME - 3D Background Scene (Three.js)
// Infinite gold grid, cyber city monoliths, floating particles

(function() {
    'use strict';

    // Check if Three.js is available
    if (!window.THREE) {
        console.log('Three.js not loaded, using fallback background');
        return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log('Reduced motion enabled, skipping 3D scene');
        return;
    }

    // Scene setup
    const canvas = document.getElementById('scene-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: window.innerWidth > 768, // Disable antialias on mobile
        alpha: true
    });

    // Cap pixel ratio for performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Mobile optimization: fewer buildings/particles
    const isMobile = window.innerWidth < 768;
    const buildingCount = isMobile ? 50 : 100;
    const particleCount = isMobile ? 500 : 1000;

    // ============================================
    // INFINITE GRID FLOOR
    // ============================================
    const gridHelper = new THREE.GridHelper(100, 50, 0xD4AF37, 0x8A6D1F);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Second grid for infinite scroll effect
    const gridHelper2 = gridHelper.clone();
    gridHelper2.position.z = -50;
    scene.add(gridHelper2);

    // ============================================
    // CYBER CITY MONOLITHS (InstancedMesh)
    // ============================================
    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterial = new THREE.MeshBasicMaterial({
        color: 0x0D0D0D,
        transparent: true,
        opacity: 0.9
    });

    const buildings = new THREE.InstancedMesh(buildingGeometry, buildingMaterial, buildingCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i++) {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60 - 20;
        const height = Math.random() * 8 + 2;
        const width = Math.random() * 2 + 1;
        const depth = Math.random() * 2 + 1;

        dummy.position.set(x, height / 2 - 2, z);
        dummy.scale.set(width, height, depth);
        dummy.updateMatrix();

        buildings.setMatrixAt(i, dummy.matrix);
    }

    scene.add(buildings);

    // Gold edge lines for buildings
    const edgesGeometry = new THREE.EdgesGeometry(buildingGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.3
    });

    const buildingEdges = new THREE.InstancedMesh(edgesGeometry, edgesMaterial, buildingCount);

    for (let i = 0; i < buildingCount; i++) {
        const matrix = new THREE.Matrix4();
        buildings.getMatrixAt(i, matrix);
        buildingEdges.setMatrixAt(i, matrix);
    }

    scene.add(buildingEdges);

    // ============================================
    // FLOATING GOLD PARTICLES
    // ============================================
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = Math.random() * 20 - 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: Math.random() * 0.02 + 0.01,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xD4AF37,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ============================================
    // ANIMATION LOOP
    // ============================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Mouse parallax (desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    // Scroll-based camera movement (if GSAP ScrollTrigger is available)
    let scrollProgress = 0;
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                scrollProgress = self.progress;
            }
        });
    }

    // Pause rendering when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            renderer.dispose();
        }
    });

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);

        if (document.hidden) return;

        time += 0.01;

        // Grid scrolling
        gridHelper.position.z = (time * 2) % 50;
        gridHelper2.position.z = gridHelper.position.z - 50;

        // Particle animation
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Reset particles that go out of bounds
            if (positions[i * 3 + 1] > 15) {
                positions[i * 3 + 1] = -5;
            }
            if (Math.abs(positions[i * 3]) > 25) {
                positions[i * 3] *= -0.9;
            }
            if (Math.abs(positions[i * 3 + 2]) > 25) {
                positions[i * 3 + 2] *= -0.9;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Mouse parallax (smooth)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 2;
        camera.position.y = 5 + targetY * 1;
        camera.lookAt(0, 0, 0);

        // Scroll-based camera dolly
        camera.position.z = 20 - scrollProgress * 10;

        // Gentle idle drift on mobile
        if (isMobile) {
            camera.position.x = Math.sin(time * 0.5) * 0.5;
            camera.position.y = 5 + Math.cos(time * 0.3) * 0.3;
        }

        renderer.render(scene, camera);
    }

    // Cinematic push-in on load
    camera.position.z = 30;
    gsap.to(camera.position, {
        z: 20,
        duration: 2,
        ease: 'power2.out',
        delay: 2
    });

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();
