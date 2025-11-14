/**
 * Van Gogh Blossom-Inspired 3D Hero
 * Interactive particle system with impressionist art aesthetics
 * Swirling patterns, vibrant colors, and organic movement
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

class VanGoghBlossomHero {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.particles = [];
        this.blossoms = [];
        this.swirls = [];
        this.mouse = new THREE.Vector2();
        this.mouseInfluence = new THREE.Vector3();

        // Van Gogh-inspired color palette
        this.vanGoghColors = {
            light: [
                0xffd700, // Golden yellow
                0xffa500, // Orange
                0xff69b4, // Pink blossom
                0x87ceeb, // Sky blue
                0x90ee90, // Light green
                0xdda0dd, // Plum
                0xf0e68c, // Khaki
                0xffdab9, // Peach
            ],
            dark: [
                0x64ffda, // Cyan
                0xc792ea, // Purple
                0x82aaff, // Blue
                0xffcb6b, // Yellow
                0xc3e88d, // Green
                0xff5370, // Red
                0x89ddff, // Light blue
                0xf07178, // Pink
            ]
        };

        this.init();
        this.createBlossoms();
        this.createSwirls();
        this.createStarField();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        const theme = this.getTheme();
        this.scene.fog = new THREE.FogExp2(
            theme === 'dark' ? 0x0a1929 : 0xfaf3e0,
            0.0015
        );

        // Camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.z = 60;
        this.camera.position.y = 10;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        this.controls.minPolarAngle = Math.PI / 3;

        // Ambient lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (like sunlight in Van Gogh paintings)
        const sunLight = new THREE.DirectionalLight(0xffd700, 0.8);
        sunLight.position.set(10, 20, 10);
        this.scene.add(sunLight);
    }

    getTheme() {
        return document.body.getAttribute('data-theme') || 'light';
    }

    getColorPalette() {
        const theme = this.getTheme();
        return this.vanGoghColors[theme];
    }

    createBlossoms() {
        const colors = this.getColorPalette();

        // Create blossom clusters (like Van Gogh's almond blossoms)
        for (let cluster = 0; cluster < 15; cluster++) {
            const clusterCenter = new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 60
            );

            // Each cluster has multiple petals
            for (let petal = 0; petal < 5; petal++) {
                const petalGeometry = this.createPetalGeometry();
                const petalColor = colors[Math.floor(Math.random() * colors.length)];

                const material = new THREE.MeshPhongMaterial({
                    color: petalColor,
                    emissive: petalColor,
                    emissiveIntensity: 0.3,
                    shininess: 30,
                    transparent: true,
                    opacity: 0.85,
                    side: THREE.DoubleSide
                });

                const mesh = new THREE.Mesh(petalGeometry, material);

                // Position around cluster center
                const angle = (petal / 5) * Math.PI * 2;
                const radius = 1.5;
                mesh.position.copy(clusterCenter);
                mesh.position.x += Math.cos(angle) * radius;
                mesh.position.y += Math.sin(angle) * radius;
                mesh.position.z += (Math.random() - 0.5) * 2;

                // Random rotation
                mesh.rotation.x = Math.random() * Math.PI;
                mesh.rotation.y = Math.random() * Math.PI;
                mesh.rotation.z = Math.random() * Math.PI;

                mesh.userData = {
                    basePosition: mesh.position.clone(),
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.01,
                        y: (Math.random() - 0.5) * 0.01,
                        z: (Math.random() - 0.5) * 0.01
                    },
                    floatOffset: Math.random() * Math.PI * 2,
                    floatAmplitude: 0.5 + Math.random() * 1
                };

                this.scene.add(mesh);
                this.blossoms.push(mesh);
            }
        }
    }

    createPetalGeometry() {
        // Create petal-like shape
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.5, 0.3, 0.8, 0.8, 0.3, 1.2);
        shape.bezierCurveTo(0, 1.0, -0.3, 1.2, -0.3, 1.2);
        shape.bezierCurveTo(-0.8, 0.8, -0.5, 0.3, 0, 0);

        const extrudeSettings = {
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    createSwirls() {
        const colors = this.getColorPalette();

        // Van Gogh-style swirling brush strokes
        for (let i = 0; i < 8; i++) {
            const points = [];
            const numPoints = 50;
            const radius = 15 + Math.random() * 10;
            const height = (Math.random() - 0.5) * 30;
            const spirals = 3 + Math.random() * 2;

            for (let j = 0; j < numPoints; j++) {
                const angle = (j / numPoints) * Math.PI * 2 * spirals;
                const t = j / numPoints;
                const r = radius * (1 - t * 0.5);

                points.push(new THREE.Vector3(
                    Math.cos(angle) * r,
                    height + Math.sin(t * Math.PI * 4) * 5,
                    Math.sin(angle) * r
                ));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.3, 8, false);

            const color = colors[i % colors.length];
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.6,
                shininess: 60
            });

            const mesh = new THREE.Mesh(tubeGeometry, material);
            mesh.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                pulseOffset: Math.random() * Math.PI * 2
            };

            this.scene.add(mesh);
            this.swirls.push(mesh);
        }
    }

    createStarField() {
        // Background stars/specks (like Van Gogh's Starry Night)
        const colors = this.getColorPalette();
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random position
            positions[i3] = (Math.random() - 0.5) * 150;
            positions[i3 + 1] = (Math.random() - 0.5) * 150;
            positions[i3 + 2] = (Math.random() - 0.5) * 150;

            // Random color from palette
            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            particleColors[i3] = color.r;
            particleColors[i3 + 1] = color.g;
            particleColors[i3 + 2] = color.b;

            // Random size
            sizes[i] = Math.random() * 2 + 0.5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particleSystem);
        this.particles.push(particleSystem);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0005;

        // Update controls
        this.controls.update();

        // Animate blossoms (gentle floating like petals in wind)
        this.blossoms.forEach((blossom) => {
            const data = blossom.userData;

            // Rotation
            blossom.rotation.x += data.rotationSpeed.x;
            blossom.rotation.y += data.rotationSpeed.y;
            blossom.rotation.z += data.rotationSpeed.z;

            // Floating motion
            blossom.position.y = data.basePosition.y +
                Math.sin(time + data.floatOffset) * data.floatAmplitude;

            // Gentle drift
            blossom.position.x = data.basePosition.x +
                Math.cos(time * 0.5 + data.floatOffset) * 0.5;
        });

        // Animate swirls (Van Gogh brush stroke movement)
        this.swirls.forEach((swirl) => {
            swirl.rotation.y += swirl.userData.rotationSpeed;

            // Pulse effect
            const scale = 1 + Math.sin(time * 2 + swirl.userData.pulseOffset) * 0.1;
            swirl.scale.set(scale, scale, scale);
        });

        // Animate particles (twinkling stars)
        this.particles.forEach((system) => {
            system.rotation.y += 0.0002;
            const positions = system.geometry.attributes.position.array;
            const sizes = system.geometry.attributes.size.array;

            for (let i = 0; i < positions.length; i += 3) {
                // Subtle wave motion
                positions[i + 1] += Math.sin(time + i) * 0.01;

                // Twinkling
                const sizeIndex = i / 3;
                sizes[sizeIndex] = (Math.sin(time * 3 + i) + 1) * 0.5 + 0.5;
            }

            system.geometry.attributes.position.needsUpdate = true;
            system.geometry.attributes.size.needsUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }

    addEventListeners() {
        // Resize handler
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });

        // Mouse movement for interactive petals
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Influence blossom positions based on mouse
            this.mouseInfluence.set(
                this.mouse.x * 5,
                this.mouse.y * 5,
                0
            );

            this.blossoms.forEach((blossom, index) => {
                if (index % 3 === 0) { // Only affect some blossoms
                    const distance = blossom.position.distanceTo(this.camera.position);
                    const influence = Math.max(0, 1 - distance / 50);

                    blossom.position.x += this.mouseInfluence.x * influence * 0.01;
                    blossom.position.y += this.mouseInfluence.y * influence * 0.01;
                }
            });
        });

        // Theme change handler
        const observer = new MutationObserver(() => {
            this.updateTheme();
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    }

    updateTheme() {
        const theme = this.getTheme();
        const colors = this.getColorPalette();

        // Update fog
        this.scene.fog.color.setHex(theme === 'dark' ? 0x0a1929 : 0xfaf3e0);

        // Update blossom colors
        this.blossoms.forEach((blossom, index) => {
            const color = colors[index % colors.length];
            blossom.material.color.setHex(color);
            blossom.material.emissive.setHex(color);
        });

        // Update swirl colors
        this.swirls.forEach((swirl, index) => {
            const color = colors[index % colors.length];
            swirl.material.color.setHex(color);
            swirl.material.emissive.setHex(color);
        });

        // Update particle colors
        this.particles.forEach((system) => {
            const particleColors = system.geometry.attributes.color.array;
            for (let i = 0; i < particleColors.length; i += 3) {
                const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
                particleColors[i] = color.r;
                particleColors[i + 1] = color.g;
                particleColors[i + 2] = color.b;
            }
            system.geometry.attributes.color.needsUpdate = true;
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVanGoghHero);
} else {
    initVanGoghHero();
}

function initVanGoghHero() {
    const container = document.getElementById('three-hero-container');
    if (container) {
        new VanGoghBlossomHero(container);
    }
}

export default VanGoghBlossomHero;
