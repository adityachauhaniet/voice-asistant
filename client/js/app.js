document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    UI.init();
    Voice.init();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        API.setAuthToken(token);
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        
        // Load user's shopping list
        API.getShoppingList()
            .then(list => {
                if (list && list.items) {
                    UI.loadItems(list.items);
                }
            })
            .catch(error => {
                console.error('Error loading shopping list:', error);
            });
    }
    
    // Event listeners for authentication buttons
    document.getElementById('loginBtn').addEventListener('click', () => {
        UI.showAuthModal('login');
    });
    
    document.getElementById('registerBtn').addEventListener('click', () => {
        UI.showAuthModal('register');
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        API.setAuthToken(null);
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('registerBtn').style.display = 'block';
        
        // Clear the shopping list
        UI.clearItems();
    });
    
    // Manual item addition
    document.getElementById('addItemBtn').addEventListener('click', () => {
        const itemText = document.getElementById('itemInput').value.trim();
        if (itemText) {
            UI.addItem(itemText);
            document.getElementById('itemInput').value = '';
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        }
    });
    
    document.getElementById('itemInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('addItemBtn').click();
        }
    });
    
    // Clear completed items
    document.getElementById('clearCompleted').addEventListener('click', () => {
        UI.clearCompletedItems();
        
        // Save to backend if user is logged in
        if (API.getAuthToken()) {
            API.saveShoppingList(UI.getItems())
                .catch(error => {
                    console.error('Error saving list:', error);
                });
        }
    });
    
    // Clear all items
    document.getElementById('clearAll').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire shopping list?')) {
            UI.clearAllItems();
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        }
    });
    
    // Save list
    document.getElementById('saveList').addEventListener('click', () => {
        if (API.getAuthToken()) {
            API.saveShoppingList(UI.getItems())
                .then(() => {
                    alert('Shopping list saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving list:', error);
                    alert('Error saving shopping list. Please try again.');
                });
        } else {
            alert('Please log in to save your shopping list.');
        }
    });
});