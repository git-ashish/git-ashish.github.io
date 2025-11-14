/**
 * Three.js 3D Data Visualization Hero
 * Interactive network visualization for portfolio hero section
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

class DataVisualizationHero {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.nodes = [];
        this.connections = [];
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.hoveredNode = null;

        this.init();
        this.createNodes();
        this.createConnections();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(
            this.getThemeColor('background'),
            0.0008
        );

        // Camera setup
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 50;

        // Renderer setup
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
        this.controls.autoRotateSpeed = 0.5;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x64ffda, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    getThemeColor(type) {
        const theme = document.body.getAttribute('data-theme') || 'light';
        const colors = {
            light: {
                background: 0xffffff,
                primary: 0x667eea,
                secondary: 0x764ba2,
                accent: 0x5a67d8
            },
            dark: {
                background: 0x0a1929,
                primary: 0x64ffda,
                secondary: 0xc792ea,
                accent: 0x82aaff
            }
        };
        return colors[theme][type];
    }

    createNodes() {
        // Data representing projects/skills
        const projectData = [
            { name: 'D3.js', size: 1.5, color: 0x64ffda, position: [0, 0, 0] },
            { name: 'Observable', size: 1.2, color: 0xc792ea, position: [8, 5, -5] },
            { name: 'React', size: 1.0, color: 0x82aaff, position: [-8, -5, 5] },
            { name: 'Three.js', size: 1.0, color: 0x667eea, position: [5, -8, 3] },
            { name: 'SAP', size: 1.3, color: 0x764ba2, position: [-5, 8, -3] },
            { name: 'Data Viz', size: 1.8, color: 0x64ffda, position: [10, 0, 8] },
            { name: 'WebGL', size: 0.9, color: 0x82aaff, position: [-10, 0, -8] },
            { name: 'SVG', size: 0.8, color: 0xc792ea, position: [0, 10, 5] },
            { name: 'Charts', size: 1.1, color: 0x667eea, position: [0, -10, -5] },
            { name: 'Analytics', size: 1.2, color: 0x764ba2, position: [12, 3, 0] },
        ];

        // Additional smaller nodes for visual effect
        for (let i = 0; i < 30; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 15 + Math.random() * 15;

            projectData.push({
                name: `Node${i}`,
                size: 0.3 + Math.random() * 0.5,
                color: [0x64ffda, 0xc792ea, 0x82aaff, 0x667eea][Math.floor(Math.random() * 4)],
                position: [
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                ]
            });
        }

        projectData.forEach(data => {
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.2,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(...data.position);
            sphere.userData = { name: data.name, originalScale: data.size };

            this.scene.add(sphere);
            this.nodes.push(sphere);
        });
    }

    createConnections() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: this.getThemeColor('primary'),
            transparent: true,
            opacity: 0.15
        });

        // Connect nodes that are close to each other
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.nodes[i].position.distanceTo(this.nodes[j].position);

                if (distance < 15) {
                    const points = [
                        this.nodes[i].position,
                        this.nodes[j].position
                    ];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);

                    this.scene.add(line);
                    this.connections.push(line);
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Animate nodes - gentle floating
        this.nodes.forEach((node, index) => {
            const time = Date.now() * 0.0005;
            node.position.y += Math.sin(time + index) * 0.01;

            // Pulse effect
            const scale = node.userData.originalScale;
            node.scale.setScalar(scale + Math.sin(time * 2 + index) * 0.05);
        });

        // Update connections
        this.connections.forEach((line, index) => {
            const positions = line.geometry.attributes.position.array;
            const nodeA = this.nodes[Math.floor(index * 2 / this.nodes.length)];
            const nodeB = this.nodes[Math.floor((index * 2 + 1) % this.nodes.length)];

            if (nodeA && nodeB) {
                positions[0] = nodeA.position.x;
                positions[1] = nodeA.position.y;
                positions[2] = nodeA.position.z;
                positions[3] = nodeB.position.x;
                positions[4] = nodeB.position.y;
                positions[5] = nodeB.position.z;
                line.geometry.attributes.position.needsUpdate = true;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });

        // Handle mouse move for interactivity
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.nodes);

            // Reset previous hovered node
            if (this.hoveredNode && !intersects.find(i => i.object === this.hoveredNode)) {
                this.hoveredNode.material.emissiveIntensity = 0.2;
                this.hoveredNode = null;
                this.container.style.cursor = 'default';
            }

            // Highlight new hovered node
            if (intersects.length > 0) {
                const node = intersects[0].object;
                if (node !== this.hoveredNode) {
                    this.hoveredNode = node;
                    node.material.emissiveIntensity = 0.8;
                    this.container.style.cursor = 'pointer';
                }
            }
        });

        // Handle theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });
        observer.observe(document.body, { attributes: true });
    }

    updateTheme() {
        const newFogColor = this.getThemeColor('background');
        this.scene.fog.color.setHex(newFogColor);

        const primaryColor = this.getThemeColor('primary');
        this.connections.forEach(line => {
            line.material.color.setHex(primaryColor);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
} else {
    initHero();
}

function initHero() {
    const container = document.getElementById('three-hero-container');
    if (container) {
        new DataVisualizationHero(container);
    }
}

export default DataVisualizationHero;
