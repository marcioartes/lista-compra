if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}
class ShoppingList {
    constructor() {
        this.items = [];
        this.editIndex = -1;
        this.init();
    }

    init() {
        // DOM Elements
        this.form = document.getElementById('itemForm');
        this.formContainer = document.getElementById('formContainer');
        this.itemsList = document.getElementById('itemsList');
        this.addButton = document.getElementById('addButton');
        this.cancelButton = document.getElementById('cancelButton');
        this.errorMessage = document.getElementById('errorMessage');
        this.submitButtonText = document.getElementById('submitButtonText');
        this.totalDisplay = document.getElementById('totalDisplay'); // Novo elemento

        // Input Elements
        this.nameInput = document.getElementById('itemName');
        this.quantityInput = document.getElementById('itemQuantity');
        this.priceInput = document.getElementById('itemPrice');

        // Event Listeners
        this.addButton.addEventListener('click', () => this.showForm());
        this.cancelButton.addEventListener('click', () => this.hideForm());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Load saved items
        this.loadItems();
        this.updateTotalDisplay(); // Atualiza o total inicial
    }

    updateTotalDisplay() {
        const total = this.calculateTotal();
        this.totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
    }

    showForm() {
        this.formContainer.classList.add('active');
        this.nameInput.focus();
    }

    hideForm() {
        this.formContainer.classList.remove('active');
        this.resetForm();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('active');
        setTimeout(() => {
            this.errorMessage.classList.remove('active');
        }, 3000);
    }

    resetForm() {
        this.form.reset();
        this.editIndex = -1;
        this.submitButtonText.textContent = 'Add Item';
    }

    handleSubmit(e) {
        e.preventDefault();

        const name = this.nameInput.value.trim();
        const quantity = parseFloat(this.quantityInput.value);
        const price = parseFloat(this.priceInput.value);

        if (!name || !quantity || !price) {
            this.showError('Please fill in all fields');
            return;
        }

        if (quantity <= 0 || price <= 0) {
            this.showError('Quantity and price must be greater than 0');
            return;
        }

        const item = {
            name,
            quantity,
            price,
            total: quantity * price
        };

        if (this.editIndex === -1) {
            this.items.push(item);
        } else {
            this.items[this.editIndex] = item;
        }

        this.saveItems();
        this.renderItems();
        this.hideForm();
        this.updateTotalDisplay(); // Atualiza o total após adicionar/editar item
    }

    editItem(index) {
        const item = this.items[index];
        this.nameInput.value = item.name;
        this.quantityInput.value = item.quantity;
        this.priceInput.value = item.price;
        this.editIndex = index;
        this.submitButtonText.textContent = 'Update Item';
        this.showForm();
    }

    deleteItem(index) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items.splice(index, 1);
            this.saveItems();
            this.renderItems();
            this.updateTotalDisplay(); // Atualiza o total após deletar item
        }
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.total, 0);
    }

    saveItems() {
        localStorage.setItem('shoppingList', JSON.stringify(this.items));
    }

    loadItems() {
        const savedItems = localStorage.getItem('shoppingList');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
            this.renderItems();
        }
    }

    renderItems() {
        this.itemsList.innerHTML = '';

        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div class="item-header">
                    <span class="item-title">${item.name}</span>
                    <div class="item-actions">
                        <button class="edit-button" onclick="shoppingList.editItem(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-button" onclick="shoppingList.deleteItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <table class="item-details">
                    <tr>
                        <td>Quantity: ${item.quantity}</td>
                        <td>Price: $${item.price.toFixed(2)}</td>
                        <td>Total: $${item.total.toFixed(2)}</td>
                    </tr>
                </table>
            `;
            this.itemsList.appendChild(itemElement);
        });

        this.updateTotalDisplay(); // Atualiza o total após renderizar os itens
    }
}

// Initialize the shopping list
const shoppingList = new ShoppingList();