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

        const product = {
            id: Date.now(),
            name: name,
            price: price,
            amount: amount
        };

        const products = getProducts();

        products.push(product);

        saveProducts(products);

        productForm.reset();

        alert("Produto adicionado com sucesso!");
    });
}

// EXIBIR PRODUTOS