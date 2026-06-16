// ==============================
// DÁVALOS DIGITAL STUDIO — JS
// GSAP ScrollTrigger animations
// ==============================

gsap.registerPlugin(ScrollTrigger);
lucide.createIcons();

// ===== HERO: Logo shrinks & fades, nav logo appears =====
const heroTL = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero-scene",
        start: "top top",
        end: "bottom 60%",
        scrub: 1
    }
});

heroTL
    .to("#hero-logo", { scale: 0.35, opacity: 0, ease: "none" })
    .to(".hero-tagline", { opacity: 0, y: -10, ease: "none" }, "<")
    .to(".scroll-hint", { opacity: 0, y: -15, ease: "none" }, "<")
    .to("#nav-logo", { opacity: 1, scale: 1, ease: "power2.out" }, "-=0.2");


// ===== SLOGAN: Word-by-word reveal (starts early) =====
const sloganWords = gsap.utils.toArray("#slogan-main .rw");

gsap.timeline({
    scrollTrigger: {
        trigger: "#slogan-scene",
        start: "top 80%",   // Starts revealing much earlier
        end: "center center",
        scrub: 0.8
    }
})
.to(sloganWords, { opacity: 1, stagger: 0.12, ease: "none" })
.to("#slogan-sub", { opacity: 1, y: 0, duration: 0.3 });


// ===== UNIVERSAL REVEAL: Apply word-reveal to ALL .reveal-text elements =====
document.querySelectorAll(".reveal-text").forEach(el => {
    // Skip the main slogan (already handled above)
    if (el.id === "slogan-main") return;
    
    const words = el.querySelectorAll(".rw");
    
    gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
            trigger: el,
            start: "top 85%",   // Start revealing as soon as text enters viewport
            end: "top 45%",
            scrub: 0.6
        }
    });
});


// ===== UNIVERSAL REVEAL-UP: Fade-up for paragraphs, icons, etc. =====
document.querySelectorAll(".reveal-up").forEach(el => {
    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse"
        }
    });
});


// ===== GALLERY: Tab switching with 3D crossfade =====
const galleryBtns = document.querySelectorAll(".gallery-btn");
const gallerySlides = document.querySelectorAll(".gallery-slide");

galleryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx);
        
        // Update active button
        galleryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Crossfade slides
        gallerySlides.forEach((slide, i) => {
            if (i === idx) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });
    });
});

// Auto-rotate gallery every 4 seconds
let currentSlide = 0;
const autoRotate = setInterval(() => {
    currentSlide = (currentSlide + 1) % gallerySlides.length;
    galleryBtns.forEach(b => b.classList.remove("active"));
    gallerySlides.forEach(s => s.classList.remove("active"));
    galleryBtns[currentSlide].classList.add("active");
    gallerySlides[currentSlide].classList.add("active");
}, 4000);

// Stop auto-rotate on manual interaction
galleryBtns.forEach(btn => {
    btn.addEventListener("click", () => clearInterval(autoRotate));
});


// ===== GALLERY VIEWPORT: Subtle 3D tilt on scroll =====
gsap.fromTo(".gallery-viewport",
    { rotateX: 6, scale: 0.95 },
    {
        rotateX: 0, scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#showcase-section",
            start: "top 70%",
            end: "center center",
            scrub: 1
        }
    }
);


// ===== PACKAGES: Subtle float-up entrance =====
gsap.from("#pkg-core", {
    y: 40, opacity: 0, duration: 0.7, ease: "power2.out",
    scrollTrigger: {
        trigger: "#packages-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});

gsap.from("#pkg-premium", {
    y: 40, opacity: 0, duration: 0.7, delay: 0.15, ease: "power2.out",
    scrollTrigger: {
        trigger: "#packages-section",
        start: "top 72%",
        toggleActions: "play none none reverse"
    }
});


// ===== FORM SUBMIT (WhatsApp Redirect) =====
const form = document.getElementById("dds-contact-form");
if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        const btn = form.querySelector(".submit-btn");
        const orig = btn.innerHTML;
        const inputs = form.querySelectorAll("input, select, textarea");
        
        const nameVal = document.getElementById("name").value.trim();
        const packageVal = document.getElementById("package").value;
        const messageVal = document.getElementById("message").value.trim();
        
        // Número de WhatsApp configurado (sin '+' ni espacios)
        const phoneNumber = "523333611174";
        
        // Estructura del mensaje predeterminado
        const textMessage = `¡Hola Dávalos Digital Studio! Mi nombre es ${nameVal}. Me interesa consultar sobre el paquete "${packageVal}".

Detalles de mi proyecto:
${messageVal}`;
        
        const encodedText = encodeURIComponent(textMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        
        // Deshabilitar campos y animación visual
        inputs.forEach(i => i.disabled = true);
        gsap.to(btn, { backgroundColor: "#005bb5", duration: 0.2 });
        btn.innerHTML = "Abriendo WhatsApp...";
        
        // Abrir WhatsApp en nueva pestaña
        window.open(whatsappUrl, '_blank');
        
        setTimeout(() => {
            btn.innerHTML = "¡Redirección completa!";
            gsap.to(btn, { backgroundColor: "#30d158", scale: 1.02, duration: 0.3 });
            
            setTimeout(() => {
                form.reset();
                inputs.forEach(i => i.disabled = false);
                gsap.to(btn, { backgroundColor: "#0071e3", scale: 1, duration: 0.3 });
                btn.innerHTML = orig;
            }, 3000);
        }, 1000);
    });
}
