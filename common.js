// 1. 静态繁星（增加闪烁效果）
const starCanvas = document.getElementById('starCanvas');
const starCtx = starCanvas.getContext('2d');
let starWidth, starHeight;
let stars = [];

function resizeStar() {
    starWidth = window.innerWidth;
    starHeight = window.innerHeight;
    starCanvas.width = starWidth;
    starCanvas.height = starHeight;
}
resizeStar();

class Star {
    constructor() {
        this.x = Math.random() * starWidth;
        this.y = Math.random() * starHeight;
        this.r = Math.random() * 1.5 + 0.5;
        this.baseAlpha = Math.random() * 0.6 + 0.3;
        this.alpha = this.baseAlpha;
        this.speed = Math.random() * 0.02 + 0.005;
        this.direction = 1;
    }
    draw() {
        // 闪烁逻辑：透明度周期变化
        this.alpha += this.speed * this.direction;
        if (this.alpha >= 1 || this.alpha <= this.baseAlpha * 0.3) {
            this.direction *= -1;
        }
        starCtx.beginPath();
        starCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        starCtx.fill();
    }
}

function createStar() {
    stars = [];
    for (let i = 220; i > 0; i--) {
        stars.push(new Star());
    }
}

function drawStarAll() {
    starCtx.clearRect(0, 0, starWidth, starHeight);
    stars.forEach(item => item.draw());
    requestAnimationFrame(drawStarAll);
}
createStar();
drawStarAll();

// 2. 动态流星雨（修复初始尺寸未初始化的bug）
const canvas = document.getElementById('meteorCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let meteors = [];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
resizeCanvas(); // 修复：初始加载就执行一次尺寸初始化

class Meteor {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.len = Math.random() * 80 + 20;
        this.speed = Math.random() * 4 + 2;
        this.angle = Math.PI / 4;
        this.opacity = Math.random() * 0.8 + 0.2;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + this.len * Math.cos(this.angle);
        const endY = this.y + this.len * Math.sin(this.angle);
        ctx.lineTo(endX, endY);
        const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
        grad.addColorStop(0, `rgba(220, 235, 255, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.y > height || this.x > width) {
            this.reset();
        }
        this.draw();
    }
}

function init() {
    meteors = [];
    for (let i = 25; i > 0; i--) {
        meteors.push(new Meteor());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    meteors.forEach(meteor => meteor.update());
    requestAnimationFrame(animate);
}
init();
animate();

// 窗口缩放统一处理
window.addEventListener('resize', function(){
    resizeStar();
    resizeCanvas();
    createStar(); // 窗口变化后重新生成星星，避免空白
    init();
});

// 3. 鼠标跟随爱心
let lastTime = 0;
const heartColors = ['#ff8fb9', '#a0c8ff', '#ffffff'];

document.addEventListener('mousemove', function(e) {
    const now = Date.now();
    if (now - lastTime < 120) return;
    lastTime = now;
    const heart = document.createElement('div');
    heart.className = 'follow-heart';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
});

document.addEventListener('touchmove', function(e) {
    const now = Date.now();
    if (now - lastTime < 120) return;
    lastTime = now;
    const touch = e.touches[0];
    const heart = document.createElement('div');
    heart.className = 'follow-heart';
    heart.style.left = touch.pageX + 'px';
    heart.style.top = touch.pageY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
});