// SIDEBAR
const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebar-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");

if (!sidebar.classList.contains("closed")) {
    sidebarOverlay.classList.add("active");
}

sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");

    if (sidebar.classList.contains("closed")) {
        sidebarOverlay.classList.remove("active");
    } else {
        sidebarOverlay.classList.add("active");
    }
});

sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("closed");
    sidebarOverlay.classList.remove("active");
});


// BANCO DE DADOS DOS PRODUTOS
const STORAGE_KEY = "webEstoqueProducts";
const HISTORY_KEY = "webEstoqueHistory";

function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getHistory(){
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addHistory(type, product, amount) {
    const history = getHistory();

    const historyItem = {
        id: Date.now(),
        type: type,
        product: product,
        amount: amount,
        date: new Date().toISOString()
    };

    history.unshift(historyItem);
    saveHistory(history);
}

// FORMULARIO ADICIONAR PRODUTO
const productForm = document.querySelector(".product-form");
if (productForm) {
    const productInput = document.getElementById("product");
    const priceInput = document.getElementById("price");
    const amountInput = document.getElementById("amount");
    const addButton = document.getElementById("formBtn");

    addButton.addEventListener("click", function () {
        const name = productInput.value.trim();
        const price = Number(priceInput.value);
        const amount = Number(amountInput.value);

        if (name === "") {
            alert("Digite o nome do produto.");
            productInput.focus();
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Digite um preço válido.");
            priceInput.focus();
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert("Digite uma quantidade válida.");
            amountInput.focus();
            return;
        }

        const products = getProducts();

        const productExist = products.some(function (product) {
            return product.name.toLowerCase() === name.toLowerCase();
        });

        if (productExist) {
            alert("Este produto já está cadastrado no estoque. \nPara editar informações de um produto existente ou adicionar mais produtos, utilize a aba Produtos");
            productInput.focus();
            return;
        }

        const product = {
            id: Date.now(),
            name: name,
            price: price,
            amount: amount
        };

        products.unshift(product);
        saveProducts(products);
        addHistory("added", product.name, product.amount);

        productForm.reset();
        alert("Produto adicionado com sucesso!");
    });
}

// FORMARTAR MOEDA PARA BRL
function formatBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    });
}

// SUMARIO
function updateSummary() {
    const totalProductsElement = document.querySelector(".summary-card:nth-child(1) .summary-value");
    const totalValueElement = document.querySelector(".summary-card:nth-child(2) .summary-value");

    if (!totalProductsElement || !totalValueElement) {
        return;
    }

    const products = getProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce(function (total, product) {
        return total + (product.price * product.amount);
    }, 0);

    totalProductsElement.textContent = totalProducts;
    totalValueElement.textContent = formatBRL(totalValue);
}

// EXIBIR PRODUTOS
const productsList = document.querySelector(".products-list");

if (productsList) {
    const products = getProducts();
    
    productsList.innerHTML = "";

    if (products.length === 0) {
        productsList.innerHTML = `
            <div class="empty-products">
                <h2>Nenhum produto cadastrado</h2>
                <p>Adicione um produto para começar seu estoque.</p>
            </div>
        `;
    } else {
        products.forEach(function (product) {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <div class="product-info">
                    <h2 class="product-name">${product.name}</h2>

                    <div class="product-details">
                        <span class="product-price">
                            Preço: <strong>${formatBRL(product.price)}</strong>
                        </span>

                        <span class="product-amount">
                            Quantidade: 
                            <strong>${product.amount === 0 ? "Sem Estoque" : product.amount}</strong>
                        </span>
                    </div>
                </div>

                <div class="product-actions">
                    <button class="product-btn edit-btn" type="button" data-id="${product.id}">
                        Editar
                    </button>

                    <button class="product-btn remove-btn" type="button" data-id="${product.id}">
                        Retirar
                    </button>

                    <button class="product-btn trash-btn" type="button" data-id="${product.id}">
                        <img class="trashcan-img" src="images/trashcan_white.svg">
                    </button>
                </div>
            `;
            
            productsList.appendChild(productCard);
        });
    }
    updateSummary();
}

// EDITAR PRODUTO
document.addEventListener("click", function(event) {
    if (!event.target.classList.contains("edit-btn")) {
        return;
    }

    const id = Number(event.target.dataset.id);
    const products = getProducts();

    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) {
        return;
    }

    let newName;
    while (true){
        newName = prompt(
            "Nome do produto",
            product.name
        );

        if (newName === null) {
            return;
        }

        if (newName.trim() !== "") {
            break;
        }
        alert("Digite um nome válido.");
    }

    let newPrice;
    while (true) {
        newPrice = prompt(
            "Preço do produto:",
            product.price
        );

        if (newPrice === null) {
            return;
        }

        newPrice = Number(newPrice);
        if (!isNaN(newPrice) && newPrice > 0) {
            break;
        }

        alert("Digite um preço válido.");
    }

    let amountToAdd;
    while (true) {
        amountToAdd = prompt(
            "Quantidade atual: " + product.amount + "\n\n" + "Quantas unidades deseja adicionar? \n(Mantenha o campo vazio caso não queira adicionar.)"
        );

        if (amountToAdd === null) {
            return;
        }

        amountToAdd = Number(amountToAdd);
        if (!isNaN(amountToAdd) && Number.isInteger(amountToAdd) && amountToAdd >= 0){
            break;
        }

        alert("Digite uma quantidade válida.");
    }

    product.name = newName.trim();
    product.price = newPrice;
    product.amount += amountToAdd;

    saveProducts(products);

    if (amountToAdd > 0) {
        addHistory("added", product.name, amountToAdd);
    }

    alert("Produto atualizado com sucesso!");
    this.location.reload();
});

// RETIRAR PRODUTO
document.addEventListener("click", function(event) {
    if (!event.target.classList.contains("remove-btn")) {
        return;
    }

    const id = Number(event.target.dataset.id);
    const products = getProducts();
    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) {
        return;
    }

    let amountToRemove;
    while (true){
        const input = prompt(
            "Produto: " + product.name + 
            " \n" + 
            "Quantidade atual: " + product.amount +
            "\n\nQuantas unidades deseja retirar?",
        );

        if (input === null) {
            return;
        }

        amountToRemove = Number(input);
        if (!isNaN(amountToRemove) 
            && Number.isInteger(amountToRemove) 
            && amountToRemove > 0 
            && amountToRemove <= product.amount
        ) {
            break;
        }

        if (amountToRemove > product.amount) {
            alert("Quantidade insuficiente para retirada.");
        } else {
            alert("Digite um número válido.");
        }
    }
    
    product.amount -= amountToRemove;
    saveProducts(products);

    addHistory("removed", product.name, amountToRemove);

    alert(amountToRemove + " Unidade(s) retirada(s) com sucesso!");
    this.location.reload();

});

// EXCLUIR PRODUTO
document.addEventListener("click", function(event) {
    const trashButton = event.target.closest(".trash-btn");
    if (!trashButton){
        return;
    }

    const id = Number(trashButton.dataset.id);
    const removeItem = confirm(
        "Deseja excluir este produto?"
    );

    if (!removeItem) {
        return;
    }

    let products = getProducts();
    products = products.filter(function (product) {
        return product.id !== id;
    });

    saveProducts(products);
    this.location.reload();
});

// HISTORICO
const historyList = document.querySelector(".history-list");
if (historyList) {
    const history = getHistory();

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <h2>Histórico vazio</h2>
                <p>Adicione um produto para começar seu estoque.</p>
            </div>
        `;
    } else {
        history.forEach(function(item) {
            const historyCard = document.createElement("div");
            historyCard.classList.add("history-card");

            const isAdded = item.type === "added";
            const title = isAdded ? "Produto adicionado" : "Produto retirado";
            const titleColor = isAdded ? "history-added" : "history-removed";

            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString("pt-BR");
            const formattedTime = date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            historyCard.innerHTML = `
                <div class="history-info">
                        <h2 class="history-product ${titleColor}">
                            ${title}<span>: ${item.product}</span>
                        </h2>

                        <div class="history-details">
                            <span class="history-amount">Quantidade: <strong>${item.amount}</strong>
                            </span>
                            
                            <span class="history-date">Data: <strong>${formattedDate} às 
                            ${formattedTime}</span>
                        </div>
                    </div>
            `;

            historyList.appendChild(historyCard);
        });
    }
}