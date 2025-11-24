let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("#campo-busca"); // Seleciona o campo de busca pelo ID
let dados = []; // Array que armazenará a lista de 69 cursos

// Função para renderizar os cards no HTML
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes
    
    if (dados.length === 0) {
        // Mensagem de "não encontrado" se a busca falhar
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
        
        // Assume que o JSON tem as propriedades 'nome', 'descricao', 'data_criacao' (ou 'ano') e 'link' (ou 'link_oficial')
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao || dado.ano}</p>
        <p>${dado.descricao}</p>
        <a href="${dado.link || dado.link_oficial}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article);
    }
}

// Função para buscar os dados, filtrar e renderizar o resultado
async function iniciarBusca() {
    // 1. Carregar dados (apenas na primeira vez)
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            
            // Verifica se a busca pelo arquivo JSON foi bem-sucedida
            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status}: O arquivo 'data.json' não foi encontrado ou está inacessível. Garanta que ele está na mesma pasta que o index.html.`);
            }
            dados = await resposta.json();
        } catch (error) {
            console.error("FALHA CRÍTICA:", error);
            cardContainer.innerHTML = `<p style='color: red; text-align: center; width: 100%;'>ERRO: Falha ao carregar a lista de cursos. Verifique se o arquivo data.json existe.</p>`;
            return;
        }
    }

    // 2. Filtrar os dados com base no texto digitado
    const termoBusca = campoBusca.value.toLowerCase();
    
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    // 3. Renderizar o resultado
    renderizarCards(dadosFiltrados);
}

// CHAMADA INICIAL: Carrega e exibe todos os cards assim que o navegador termina de carregar o HTML.
document.addEventListener("DOMContentLoaded", () => {
    iniciarBusca();
});