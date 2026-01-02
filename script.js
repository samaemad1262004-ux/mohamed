// 🔹 جلب عنصر الكانفس
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 🔹 دالة لتغيير حجم الكانفس حسب الشاشة
function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener("resize", resize);

// 🔹 عداد الوقت للأنيميشن
let time = 0;

// 🔹 مصفوفة لتخزين جميع جزيئات القلب
const particles = [];

// 🔹 تعريف شكل الجزيئة الواحدة
class Particle {
    constructor(angle, radius) {
        this.baseAngle = angle;
        this.radius = radius;
        this.size = Math.random() * 1.8 + 0.5;
        this.speed = Math.random() * 0.02 + 0.01; // سرعة الدوران
        this.offset = Math.random() * 100; // تأخير عشوائي للحركة
    }

    draw(scale, time) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        // حركة دائرية حول قلب متذبذب
        const angle = this.baseAngle + this.speed * time;
        const dynamicRadius = this.radius + 0.2 * Math.sin(time + this.offset);

        const x = cx + scale * dynamicRadius * 16 * Math.pow(Math.sin(angle), 3);
        const y = cy - scale * dynamicRadius *
            (13 * Math.cos(angle) -
                5 * Math.cos(2 * angle) -
                2 * Math.cos(3 * angle) -
                Math.cos(4 * angle));

        ctx.beginPath();
        ctx.arc(x, y, this.size + Math.sin(time + this.offset) * 0.5, 0, Math.PI * 2);

        // لون متغير مع الوقت لإحساس بالحركة
        ctx.fillStyle = `rgba(${255}, ${Math.floor(80 + 50*Math.sin(time + this.offset))}, ${80}, 0.9)`;

        // Glow متغير
        ctx.shadowColor = `rgba(255, 0, 0, 0.7)`;
        ctx.shadowBlur = 10 + 10 * Math.sin(time + this.offset);

        ctx.fill();
    }
}

// 🔹 دالة إنشاء جميع الجزيئات للقلب
function createHeart() {
    particles.length = 0;
    const count = window.innerWidth < 600 ? 600 : 900;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            Math.random() * Math.PI * 2,
            Math.random() * 1.2
        ));
    }
}
createHeart();
window.addEventListener("resize", createHeart);

// 🔹 دالة الأنيميشن الرئيسية
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.05; // زيادة السرعة لنبض أكتر

    const baseScale = window.innerWidth < 600 ? 9 : 12;
    const scale = baseScale + Math.sin(time) * 0.8; // نبض أكبر

    // رسم الجزيئات
    particles.forEach(p => p.draw(scale, time));

    // رسم الاسم في منتصف القلب
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.shadowColor = "red";
    ctx.shadowBlur = 18;

    const fontSize = window.innerWidth < 600 ? window.innerWidth * 0.08 : 48;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText("Mohamed", window.innerWidth / 2, window.innerHeight / 2);
    ctx.restore();

    requestAnimationFrame(animate);
}

// 🔹 بدء الأنيميشن
animate();