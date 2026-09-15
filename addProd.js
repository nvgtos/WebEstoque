// ==============================
// BANCO DE DADOS DOS PRODUTOS
// ==============================

const STORAGE_KEY = "webEstoqueProdutos";

function obterProdutos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarProdutos(produtos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}


// ==============================
// ADICIONAR PRODUTO
// ==============================

const productForm = document.querySelector(".product-form");

if (productForm) {

    const productInput = document.querySelector("#product");
    const priceInput = document.querySelector("#price");
    const amountInput = document.querySelector("#amount");
    const addButton = document.querySelector(".form-btn");

    addButton.addEventListener("click", function () {

        const nome = productInput.value.trim();
        const preco = Number(priceInput.value);
        const quantidade = Number(amountInput.value);

        // Validação
        if (nome === "") {
            alert("Digite o nome do produto.");
            productInput.focus();
            return;
        }

        if (isNaN(preco) || preco <= 0) {
            alert("Digite um preço válido.");
            priceInput.focus();
            return;
        }

        if (isNaN(quantidade) || quantidade <= 0) {
            alert("Digite uma quantidade válida.");
            amountInput.focus();
            return;
        }

        // Novo produto
        const produto = {
            id: Date.now(),
            nome: nome,
            preco: preco,
            quantidade: quantidade
        };

        // Recupera os produtos existentes
        const produtos = obterProdutos();

        // Adiciona o novo produto
        produtos.push(produto);

        // Salva
        salvarProdutos(produtos);

        // Limpa o formulário
        productForm.reset();

        // Mensagem
        alert("Produto adicionado com sucesso!");

        // Vai para a página de produtos
        window.location.href = "produtos.html";
    });
}


// ==============================
// EXIBIR PRODUTOS
// ==============================

const productsList = document.querySelector(".products-list");

if (productsList) {

    const produtos = obterProdutos();

    productsList.innerHTML = "";

    if (produtos.length === 0) {

        productsList.innerHTML = `
            <div class="empty-products">
                <h2>Nenhum produto cadastrado</h2>
                <p>Adicione um produto para começar seu estoque.</p>
            </div>
        `;

    } else {

        produtos.forEach(function (produto) {

            const productCard = document.createElement("div");

            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <div class="product-info">

                    <h2 class="product-name">
                        ${produto.nome}
                    </h2>

                    <div class="product-details">

                        <span class="product-price">
                            Preço:
                            <strong>
                                ${formatarMoeda(produto.preco)}
                            </strong>
                        </span>

                        <span class="product-amount">
                            Quantidade:
                            <strong>
                                ${produto.quantidade}
                            </strong>
                        </span>

                    </div>

                </div>

                <div class="product-actions">

                    <button
                        class="product-btn edit-btn"
                        type="button"
                        data-id="${produto.id}">
                        Editar
                    </button>

                    <button
                        class="product-btn delete-btn"
                        type="button"
                        data-id="${produto.id}">
                        Excluir
                    </button>

                </div>
            `;

            productsList.appendChild(productCard);
        });
    }

    atualizarResumo();
}


// ==============================
// FORMATAÇÃO DE MOEDA
// ==============================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ==============================
// RESUMO DO ESTOQUE
// ==============================

function atualizarResumo() {

    const totalProdutosElement =
        document.querySelector(".summary-card:nth-child(1) .summary-value");

    const valorTotalElement =
        document.querySelector(".summary-card:nth-child(2) .summary-value");

    if (!totalProdutosElement || !valorTotalElement) {
        return;
    }

    const produtos = obterProdutos();

    // Soma a quantidade de todos os produtos
    const totalQuantidade = produtos.reduce(function (total, produto) {
        return total + produto.quantidade;
    }, 0);

    // Soma preço × quantidade
    const valorTotal = produtos.reduce(function (total, produto) {
        return total + (produto.preco * produto.quantidade);
    }, 0);

    totalProdutosElement.textContent = totalQuantidade;

    valorTotalElement.textContent = formatarMoeda(valorTotal);
}


// ==============================
// EXCLUIR PRODUTO
// ==============================

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const id = Number(event.target.dataset.id);

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    let produtos = obterProdutos();

    produtos = produtos.filter(function (produto) {
        return produto.id !== id;
    });

    salvarProdutos(produtos);

    // Atualiza a página
    location.reload();
});


// ==============================
// EDITAR PRODUTO
// ==============================

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-btn")) {
        return;
    }

    const id = Number(event.target.dataset.id);

    const produtos = obterProdutos();

    const produto = produtos.find(function (produto) {
        return produto.id === id;
    });

    if (!produto) {
        return;
    }

    const novoNome = prompt(
        "Nome do produto:",
        produto.nome
    );

    if (novoNome === null || novoNome.trim() === "") {
        return;
    }

    const novoPreco = prompt(
        "Preço do produto:",
        produto.preco
    );

    if (novoPreco === null || Number(novoPreco) <= 0) {
        alert("Preço inválido.");
        return;
    }

    const novaQuantidade = prompt(
        "Quantidade:",
        produto.quantidade
    );

    if (
        novaQuantidade === null ||
        Number(novaQuantidade) <= 0
    ) {
        alert("Quantidade inválida.");
        return;
    }

    produto.nome = novoNome.trim();
    produto.preco = Number(novoPreco);
    produto.quantidade = Number(novaQuantidade);

    salvarProdutos(produtos);

    location.reload();
});

