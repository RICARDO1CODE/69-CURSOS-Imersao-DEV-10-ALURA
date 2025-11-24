let cardContainer = document.querySelector(".card-container");
// O seletor correto para o campo de busca (o input dentro do header)
let campoBusca = document.querySelector("header input"); 
let dados = [];

// Função que renderiza os cards no HTML (COM O CARD INTEIRO CLICÁVEL)
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes
    
    if (dados.length === 0) {
        cardContainer.innerHTML = `
            <p style='color: var(--secondary-color); font-size: 1.2rem; text-align: center; width: 100%;'>
                Nenhum curso encontrado com o termo digitado.
            </p>
        `;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        
        // 1. Cria o elemento <a> que envolve todo o conteúdo do card
        let anchor = document.createElement("a");
        anchor.href = dado.link;        
        anchor.target = "_blank";       
        anchor.classList.add("card-link-wrapper"); 

        // 2. Adiciona TODO o conteúdo do card dentro do link
        anchor.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao || dado.ano}</p>
        <p>${dado.descricao}</p>
        <span class="saiba-mais-label">Saiba mais &raquo;</span>
        `;
        
        // 3. Adiciona o link (com todo o conteúdo dentro) ao article
        article.appendChild(anchor);
        cardContainer.appendChild(article);
    }
}

// Função principal que carrega os dados e realiza a busca/filtragem
async function iniciarBusca() {
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            
            if (!resposta.ok) {
                throw new Error(`Erro ao buscar (Status: ${resposta.status}).`);
            }
            dados = await resposta.json();
            // Adiciona a funcionalidade de busca/filtro ao campo de input
            campoBusca.addEventListener("input", iniciarBusca);
        } catch (error) {
            console.error("ERRO CRÍTICO NA CARGA DO JSON:", error);
            cardContainer.innerHTML = `<p style='color: red; text-align: center; width: 100%;'>
                ERRO: Falha ao carregar a lista de cursos.
            </p>`;
            return;
        }
    }

    const termoBusca = campoBusca.value.toLowerCase();
    
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    renderizarCards(dadosFiltrados);
}

// Chamada inicial: Carrega e exibe TUDO na abertura da página.
document.addEventListener("DOMContentLoaded", () => {
    iniciarBusca(); 
});
