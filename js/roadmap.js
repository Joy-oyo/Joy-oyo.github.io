// Interactive Roadmap JavaScript
class PortfolioRoadmap {
    constructor() {
        this.init();
    }
    
    init() {
        this.createParticles();
        this.initializeRoadmapInteractions();
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('roadmapParticles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'roadmap-particle';
            
            // Random positioning
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    initializeRoadmapInteractions() {
        const modules = document.querySelectorAll('.portfolio-module');
        const paths = document.querySelectorAll('.road-path');
        
        modules.forEach(module => {
            module.addEventListener('mouseenter', () => {
                const moduleType = module.dataset.module;
                this.highlightConnections(moduleType);
            });
            
            module.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });
    }
    
    highlightConnections(moduleType) {
        const paths = document.querySelectorAll('.road-path');
        paths.forEach(path => {
            const connectedModules = path.dataset.modules.split(',');
            if (connectedModules.includes(moduleType)) {
                path.classList.add('active');
            }
        });
    }
    
    resetConnections() {
        const paths = document.querySelectorAll('.road-path');
        paths.forEach(path => {
            path.classList.remove('active');
        });
    }
}

// Initialize the roadmap when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioRoadmap();
}); 