// Função para obter o diretório base do site
function getBaseDirectory() {
    const base = window.location.pathname;
    return base.endsWith('/') ? base : base + '/';
}

// Função para carregar o conteúdo de um arquivo HTML e inseri-lo nos elementos alvo
async function load_includes(filePath, targetSelector) {
    try {
        const baseDirectory = getBaseDirectory();
        const response = await fetch(baseDirectory + filePath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${filePath}`);
        }
        const htmlContent = await response.text();

        // Inserir o conteúdo em todos os elementos que correspondem ao seletor
        const targetElements = document.querySelectorAll(`.${targetSelector}`);
        targetElements.forEach(element => {
            element.innerHTML = htmlContent;
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para carregar o conteúdo de um arquivo HTML específico para autores e atualizar a contagem de posts
async function load_author_includes(filePath, targetSelector, authorName, postCount) {
    try {
        const baseDirectory = getBaseDirectory();
        const response = await fetch(baseDirectory + filePath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${filePath}`);
        }
        let htmlContent = await response.text();

        // Atualizar o número de publicações no HTML do autor
        htmlContent = htmlContent.replace(/<a href="#">Autor de \d+ <i>publicações<\/i><\/a>/, `<a href="#">Autor de ${postCount} <i>publicações</i></a>`);

        // Inserir o conteúdo em todos os elementos que correspondem ao seletor
        const targetElements = document.querySelectorAll(`.${targetSelector}`);
        targetElements.forEach(element => {
            element.innerHTML = htmlContent;
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para contar o número de posts de cada autor
async function countPosts() {
    try {
        const baseDirectory = getBaseDirectory();
        const response = await fetch(baseDirectory + 'blog/posts.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar /blog/posts.json');
        }
        const posts = await response.json();

        // Contagem de posts por autor
        const authorPostCount = {};
        posts.forEach(post => {
            const author = post.author;
            if (authorPostCount[author]) {
                authorPostCount[author]++;
            } else {
                authorPostCount[author] = 1;
            }
        });

        return authorPostCount;
    } catch (error) {
        console.error('Erro:', error);
        return {};
    }
}

// Função principal para inicializar o carregamento dos modelos de autores
async function initializeAuthors() {
    const authorPostCount = await countPosts();

    // Iterar sobre todas as seções de autores e carregar o conteúdo correspondente
    Object.keys(authorPostCount).forEach(author => {
        // Substitua espaços por hífens e converta para minúsculas para corresponder ao nome do arquivo
        const targetSelector = author.toLowerCase().replace(/\s+/g, '-');
        const postCount = authorPostCount[author];
        const filePath = `includes/autores/${targetSelector}.html`;

        load_author_includes(filePath, targetSelector, author, postCount);
    });
}

// CARREGAR HEADER
load_includes('includes/nav-links.html', 'nav-links');

// Função para obter categorias únicas dos posts
function getUniqueCategories(posts) {
    const categories = new Set();
    posts.forEach(post => {
        categories.add(post.category);
    });
    return Array.from(categories);
}

// Função para renderizar as categorias e adicionar eventos de clique
function renderCategories(categories, posts) {
    const tagsWrapper = document.querySelector('.tags-wrapper');
    
    if (tagsWrapper) {
        tagsWrapper.innerHTML = ''; // Limpa as categorias existentes
        
        const allTag = document.createElement('div');
        allTag.className = 'tag-item active'; // Inicialmente, "Tudo" está ativo
        allTag.textContent = 'Tudo';
        tagsWrapper.appendChild(allTag);

        categories.forEach(category => {
            const tagItem = document.createElement('div');
            tagItem.className = 'tag-item';
            tagItem.textContent = category;
            tagsWrapper.appendChild(tagItem);
        });

        // Adicionar eventos de clique a cada categoria
        const tagItems = tagsWrapper.querySelectorAll('.tag-item');
        tagItems.forEach(tag => {
            tag.addEventListener('click', function() {
                // Remove a classe 'active' de todas as categorias
                tagItems.forEach(tag => tag.classList.remove('active'));
                // Adiciona a classe 'active' à categoria clicada
                this.classList.add('active');

                // Filtrar os posts pela categoria selecionada
                const filteredPosts = filterPostsByCategory(posts, this.textContent);
                renderCards(filteredPosts);
            });
        });
    }
}

// Inicializar a criação dos cards com busca e categorias dinâmicas
async function initSearchAndCategories() {
    const posts = await loadPosts();
    
    // Renderizar as categorias dinâmicas e configurar eventos de clique
    const uniqueCategories = getUniqueCategories(posts);
    renderCategories(uniqueCategories, posts);
    
    // Renderizar todos os posts inicialmente
    renderCards(posts);

    // Configurar o sistema de busca
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = filterPosts(posts, searchTerm);
        renderCards(filteredPosts);
    });
}

// Carregar categorias, autores e outros conteúdos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    initSearchAndCategories();
    initializeAuthors();
    
    // Carregar depoimentos, aliados, monitores e footer
    load_includes('includes/depoimentos.html', 'depoimentos-wrapper .swiper-wrapper');
    load_includes('includes/aliados.html', 'aliados-monitores');
    load_includes('includes/footer.html', 'footer');
});
