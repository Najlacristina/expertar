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


// SCRIPT REFERENTE AO SLIDE DE DEPOIMENTOS
var swiper = new Swiper(".depoimentos-wrapper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    centeredSlides: false,
});


// SCRIPT QUE CRIA OS CARDS DOS POSTS
// Função para carregar o JSON de posts
async function loadPosts() {
    try {
        const response = await fetch('posts.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar /blog/posts.json');
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

// Função para criar os cards a partir dos posts
async function createCards() {
    const posts = await loadPosts();
    const cardsContainer = document.querySelector('#cards .cards-wrapper');

    if (cardsContainer) {
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card-item';
            card.innerHTML = `
                <a href="/blog/${post.slug}" class="card-link">
                    <div class="card-header">
                        <img src="/blog/assets/images/${post.image}" alt="${post.title}">
                        <div class="tag-category">${post.category}</div>
                    </div>
                    <div class="card-content">
                        <h4>${post.title}</h4>
                        <p>${post.summary}</p>
                    </div>
                    <div class="card-footer">
                        <div class="author"><img src="/blog/assets/images/${post.author.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${post.author}"><h6>${post.author}</h6></div>
                        <div class="divider"></div>
                        <div class="post-date">${post.date}</div>
                    </div>
                </a>
            `;
            cardsContainer.appendChild(card);
        });
    }
}

// Inicializar a criação dos cards
createCards();


// Função para filtrar os posts conforme o termo de busca
function filterPosts(posts, searchTerm) {
    return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.summary.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm) ||
        post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
}


// Função para renderizar os cards filtrados
function renderCards(filteredPosts) {
    const cardsContainer = document.querySelector('#cards .cards-wrapper');
    cardsContainer.innerHTML = ''; // Limpa os cards existentes

    if (filteredPosts.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results';
        noResultsMessage.innerText = 'Nenhum post encontrado, revise os termos da busca.';
        cardsContainer.appendChild(noResultsMessage);
    } else {
        filteredPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card-item';
            card.innerHTML = `
                <a href="/blog/${post.slug}" class="card-link">
                    <div class="card-header">
                        <img src="/blog/assets/images/${post.image}" alt="${post.title}">
                        <div class="tag-category">${post.category}</div>
                    </div>
                    <div class="card-content">
                        <h4>${post.title}</h4>
                        <p>${post.summary}</p>
                    </div>
                    <div class="card-footer">
                        <div class="author"><img src="/blog/assets/images/${post.author.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${post.author}"><h6>${post.author}</h6></div>
                        <div class="divider"></div>
                        <div class="post-date">${post.date}</div>
                    </div>
                </a>
            `;
            cardsContainer.appendChild(card);
        });
    }
}


// Inicializar a criação dos cards com busca
async function initSearchAndCards() {
    const posts = await loadPosts();
    renderCards(posts); // Renderiza todos os posts inicialmente

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = filterPosts(posts, searchTerm);
        renderCards(filteredPosts); // Renderiza os posts filtrados
    });
}

initSearchAndCards();

// Função para filtrar os posts conforme a categoria
function filterPostsByCategory(posts, category) {
    if (category === 'Tudo') {
        return posts; // Se a categoria for "Tudo", retorna todos os posts
    }
    return posts.filter(post => post.category === category);
}

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