const UI = {
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // Modal close button
        document.querySelector('.close').addEventListener('click', this.hideAuthModal);
        
        // Click outside modal to close
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('authModal');
            if (event.target === modal) {
                this.hideAuthModal();
            }
        });
        
        // Auth form submission
        document.getElementById('authForm').addEventListener('submit', this.handleAuthFormSubmit.bind(this));
    },
    
    showAuthModal: function(mode) {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('modalTitle');
        const nameField = document.getElementById('nameField');
        const submitBtn = document.getElementById('authSubmit');
        
        if (mode === 'register') {
            title.textContent = 'Register';
            nameField.style.display = 'block';
            submitBtn.textContent = 'Register';
        } else {
            title.textContent = 'Login';
            nameField.style.display = 'none';
            submitBtn.textContent = 'Login';
        }
        
        modal.style.display = 'block';
        document.getElementById('authForm').dataset.mode = mode;
    },
    
    hideAuthModal: function() {
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('authForm').reset();
    },
    
    handleAuthFormSubmit: function(e) {
        e.preventDefault();
        
        const mode = e.target.dataset.mode;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (mode === 'register') {
            const name = document.getElementById('name').value;
            API.register(name, email, password)
                .then(response => {
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                        API.setAuthToken(response.token);
                        this.hideAuthModal();
                        document.getElementById('logoutBtn').style.display = 'block';
                        document.getElementById('loginBtn').style.display = 'none';
                        document.getElementById('registerBtn').style.display = 'none';
                        alert('Registration successful!');
                    }
                })
                .catch(error => {
                    alert('Registration failed: ' + error.message);
                });
        } else {
            API.login(email, password)
                .then(response => {
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                        API.setAuthToken(response.token);
                        this.hideAuthModal();
                        document.getElementById('logoutBtn').style.display = 'block';
                        document.getElementById('loginBtn').style.display = 'none';
                        document.getElementById('registerBtn').style.display = 'none';
                        
                        // Load user's shopping list
                        API.getShoppingList()
                            .then(list => {
                                if (list && list.items) {
                                    this.loadItems(list.items);
                                }
                            });
                    }
                })
                .catch(error => {
                    alert('Login failed: ' + error.message);
                });
        }
    },
    
    addItem: function(name, quantity = '1') {
        const itemsList = document.getElementById('itemsList');
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
            <div class="item-content">
                <input type="checkbox" class="item-checkbox">
                <span class="item-name">${name}</span>
                <span class="item-quantity">${quantity}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        
        // Add event listeners to the new item
        const checkbox = li.querySelector('.item-checkbox');
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed', this.checked);
        });
        
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            li.remove();
        });
        
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', function() {
            const currentName = li.querySelector('.item-name').textContent;
            const currentQuantity = li.querySelector('.item-quantity').textContent;
            
            const newName = prompt('Edit item name:', currentName);
            if (newName !== null && newName.trim() !== '') {
                li.querySelector('.item-name').textContent = newName.trim();
                
                const newQuantity = prompt('Edit quantity:', currentQuantity);
                if (newQuantity !== null && newQuantity.trim() !== '') {
                    li.querySelector('.item-quantity').textContent = newQuantity.trim();
                }
            }
        });
        
        itemsList.appendChild(li);
    },
    
    removeItem: function(itemName) {
        const items = document.querySelectorAll('.item');
        for (const item of items) {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            if (name.includes(itemName.toLowerCase())) {
                item.remove();
                break;
            }
        }
    },
    
    markItemAsCompleted: function(itemName) {
        const items = document.querySelectorAll('.item');
        for (const item of items) {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            if (name.includes(itemName.toLowerCase())) {
                const checkbox = item.querySelector('.item-checkbox');
                checkbox.checked = true;
                item.classList.add('completed');
                break;
            }
        }
    },
    
    clearCompletedItems: function() {
        const completedItems = document.querySelectorAll('.item.completed');
        completedItems.forEach(item => item.remove());
    },
    
    clearAllItems: function() {
        document.getElementById('itemsList').innerHTML = '';
    },
    
    loadItems: function(items) {
        this.clearAllItems();
        items.forEach(item => {
            this.addItem(item.name, item.quantity);
            
            // Mark as completed if needed
            if (item.completed) {
                const itemsList = document.getElementById('itemsList');
                const lastItem = itemsList.lastChild;
                const checkbox = lastItem.querySelector('.item-checkbox');
                checkbox.checked = true;
                lastItem.classList.add('completed');
            }
        });
    },
    
    getItems: function() {
        const items = [];
        const itemElements = document.querySelectorAll('.item');
        
        itemElements.forEach(itemEl => {
            const name = itemEl.querySelector('.item-name').textContent;
            const quantity = itemEl.querySelector('.item-quantity').textContent;
            const completed = itemEl.classList.contains('completed');
            
            items.push({
                name,
                quantity,
                completed
            });
        });
        
        return items;
    }
};