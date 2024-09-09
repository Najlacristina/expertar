const hamburgers = document.querySelectorAll(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburgers.forEach((hamburger) => {
    hamburger.addEventListener('click', ()=>{
        //Animate Links
         navLinks.classList.toggle("open");
         links.forEach(link => {
             link.classList.toggle("fade");
         });
     
         //Hamburger Animation
         hamburger.classList.toggle("toggle");
     });
});

function updateFaqStyles() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(faqItem => {
        const radioInput = faqItem.querySelector('input[type="radio"]');
        const faqContent = faqItem.querySelector('.faq-content');

        if (radioInput.checked) {
            faqContent.style.padding = '20px 20px';
            faqContent.style.height = `calc(${faqContent.scrollHeight}px + 40px)`;
            faqContent.style.transition = 'all 1s';
        } else {
            faqContent.style.padding = '0px 20px';
            faqContent.style.height = '0';
        }

        faqContent.style.transition = 'all 1s ease';
        faqContent.style.overflow = 'hidden';
    });
}

const radioInputs = document.querySelectorAll('input[type="radio"][name="faq"]');

radioInputs.forEach(radio => {
    radio.addEventListener('change', updateFaqStyles);
});

updateFaqStyles();


// COOKIES RULES
console.log(document.cookie.split('; ').find(row => row.startsWith('cookiesAccepted=')));
document.addEventListener('DOMContentLoaded', function() {
    if(!document.cookie.split('; ').find(row => row.startsWith('cookiesAccepted='))) {
        console.log('Cookie Not ok');
        document.getElementById('cookie-banner').classList.remove('hidden');
    }


    // Adicionar evento de clique ao botão "OK"
    document.getElementById('accept-cookies').addEventListener('click', function() {
        // Esconder o banner
        document.getElementById('cookie-banner').classList.add('hidden');
        // Definir o cookie "cookiesAccepted"
        document.cookie = "cookiesAccepted=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/"; // Expira em 30 dias
    });
});

// ANIMAÇÃO MENU
window.addEventListener('scroll', function() {
    var minhaDiv = document.querySelector('.container-menu');

    if (window.scrollY > 50) {
      minhaDiv.classList.add('scrolled');
    } else {
      minhaDiv.classList.remove('scrolled');
    }
});
