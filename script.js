let cardContainer = document.querySelector(".card-container");
// Usando o seletor que está no seu código atual
let campoBusca = document.querySelector("header input"); 
let dados = [];

// Função que renderiza os cards no HTML (AGORA COM O CARD INTEIRO CLICÁVEL)
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes
    
    if (dados.length === 0) {
        // Mensagem de "não encontrado"
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
        anchor.href = dado.link;        // Usa o link do data.json
        anchor.target = "_blank";       // Abre em uma nova aba
        anchor.classList.add("card-link-wrapper"); // Classe para estilização

        // 2. Adiciona TODO o conteúdo do card (título, descrição, etc.) dentro do link
        anchor.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao || dado.ano}</p>
        <p>${dado.descricao}</p>
        <span class="saiba-mais-label">Saiba mais &raquo;</span> `;
        
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
                // Captura erro de Status (404, etc.)
                throw new Error(`Erro ao buscar (Status: ${resposta.status}). Verifique o console para detalhes.`);
            }
            dados = await resposta.json();
        } catch (error) {
            console.error("ERRO CRÍTICO NA CARGA DO JSON. USE F12 PARA VER O DETALHE:", error);
            cardContainer.innerHTML = `<p style='color: red; text-align: center; width: 100%;'>
                ERRO: Falha ao carregar a lista de cursos. Verifique a sintaxe do data.json.
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
    // Garante que a busca seja iniciada também ao pressionar ENTER no campo de busca
    campoBusca.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            iniciarBusca();
        }
    });
});
