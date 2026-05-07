document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;
    
    // Formas clássicas de controle (PlayStation/Geral)
    const gamerShapes = ['▲', '●', '✖', '■', '+'];

    // Cria as partículas
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Define a forma do controle aleatoriamente
        const shape = gamerShapes[Math.floor(Math.random() * gamerShapes.length)];
        particle.innerText = shape;
        
        // Posição horizontal aleatória
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Começa de baixo
        particle.style.top = `${100 + Math.random() * 20}vh`;
        
        // Duração da animação
        const duration = Math.random() * 8 + 4;
        particle.style.animationDuration = `${duration}s`;
        
        // Atraso
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;

        // Cores neon gamer
        const colors = ['#ff007f', '#00f2fe', '#66fcf1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.color = color;
        
        // Tamanho aleatório
        particle.style.fontSize = `${Math.random() * 15 + 10}px`;

        particlesContainer.appendChild(particle);
        
        // Recria a partícula quando ela some
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + delay) * 1000);
    }
    
    // Efeito 3D que segue o mouse
    const container = document.querySelector('.container');
    const customCursor = document.getElementById('custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        // Calcula a rotação com base no centro da tela
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / -40;
        
        container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        
        // Move o cursor customizado (mira/crosshair)
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });
    
    // Muda a mira quando passa o mouse por cima do container (hover effect)
    container.addEventListener('mouseenter', () => {
        customCursor.classList.add('cursor-hover');
    });
    
    container.addEventListener('mouseleave', () => {
        customCursor.classList.remove('cursor-hover');
    });
    
    // Reseta o card quando o mouse sai da tela
    document.addEventListener('mouseleave', () => {
        container.style.transform = `rotateY(0deg) rotateX(0deg)`;
        container.style.transition = 'transform 0.5s ease-out';
    });
    
    document.addEventListener('mouseenter', () => {
        container.style.transition = 'transform 0.1s ease-out';
    });

    // --- Shooting Game Logic ---
    let score = 0;
    const scoreDisplay = document.getElementById('score-display');
    const gameContainer = document.getElementById('game-container');
    
    function spawnTarget() {
        if (!gameContainer) return;
        
        const target = document.createElement('div');
        target.classList.add('target');
        
        // Random position within the screen
        const x = Math.random() * (window.innerWidth - 60) + 10;
        const y = Math.random() * (window.innerHeight - 60) + 10;
        
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        
        gameContainer.appendChild(target);
        console.log("Alien spawned!"); // Debug log
        
        // Remove target after a few seconds if not shot
        const timeoutId = setTimeout(() => {
            if (target.parentNode) {
                target.remove();
            }
        }, 4000);
        
        target.addEventListener('mousedown', (e) => {
            // Increase score
            score += 100;
            if (scoreDisplay) scoreDisplay.innerText = score;
            
            // Create explosion
            createExplosion(e.clientX, e.clientY);
            
            // Clear timeout and remove target
            clearTimeout(timeoutId);
            target.remove();
            
            // Stop event from reaching the document mousedown listener and triggering the container 3D effect weirdly
            e.stopPropagation();
            triggerShootEffect();
        });
    }
    
    function createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.classList.add('target-explosion');
        explosion.innerText = '💥';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        
        document.body.appendChild(explosion);
        
        setTimeout(() => {
            explosion.remove();
        }, 500);
    }
    
    function triggerShootEffect() {
        customCursor.classList.remove('shoot-pulse'); // reset animation if clicked fast
        void customCursor.offsetWidth; // trigger reflow
        customCursor.classList.add('shoot-pulse');
    }
    
    // Spawn targets periodically
    setInterval(spawnTarget, 1500);
    
    // Global click listener for shooting effect
    document.addEventListener('mousedown', () => {
        triggerShootEffect();
    });
});
