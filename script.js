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
// Fecha a sidebar ao clicar fora dela
sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("closed");
    sidebarOverlay.classList.remove("active");
});


// BANCO DE DADOS DOS PRODUTOS
const STORAGE_KEY = "webEstoqueProducts";

function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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
            alert("Este produto já está cadastrado no estoque. \nEdite as informações como nome e preço de um produto existente na aba Produtos.");
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

        productForm.reset();

        alert("Produto adicionado com sucesso!");
    });
}

// FORMARTAR MOEDA PARA BRL
function formatBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
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
                            Quantidade: <strong>${product.amount}</strong>
                        </span>
                    </div>
                </div>

                <div class="product-actions">
                    <button
                        class="product-btn edit-btn"
                        type="button"
                        data-id="${product.id}">
                        Editar
                    </button>

                    <button
                        class="product-btn delete-btn"
                        type="button"
                        data-id="${product.id}">
                        Retirar
                    </button>
                </div>
            `;
            
            productsList.appendChild(productCard);
        });
    }
    updateSummary();
}

// SUMARIO
function updateSummary() {
    const totalProductsElement = document.querySelector(".summary-card:nth-child(1) .summary-value");
    const totalValueElement = document.querySelector(".summary-card:nth-child(2) .summary-value");

    if (!totalProductsElement || !totalValueElement) {
        return;
    }

    const products = getProducts();

    const totalAmount = products.reduce(function (total, product) {
        return total + product.amount;
    }, 0);

    const totalValue = products.reduce(function (total, product) {
        return total + (product.price * product.amount);
    }, 0);

    totalProductsElement.textContent = totalAmount;
    totalValueElement.textContent = formatBRL(totalValue);
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
    let price;
    while (true) {
        newPrice = prompt(
            "Preço do produto:",
            product.price
        );

        if (newPrice === null) {
            return;
        }

        price = Number(newPrice);
        if (!isNaN(price) && price > 0) {
            break;
        }

        alert("Digite um preço válido.");
    }

    let addAmount;
    let amountToAdd;
    while (true) {
        addAmount = prompt(
            "Quantidade atual: " + product.amount + "\n\n" + "Quantas unidades deseja adicionar? \n(Mantenha o campo vazio caso não queira adicionar.)"
        );

        if (addAmount === null) {
            return;
        }

        amountToAdd = Number(addAmount);
        if (!isNaN(amountToAdd) && amountToAdd >= 0){
            break;
        }

        alert("Digite uma quantidade válida.");
    }

    product.name = newName.trim();
    product.price = price;
    product.amount += amountToAdd;

    saveProducts(products);
    alert("Produto atualizado com sucesso!");
    this.location.reload();
});
