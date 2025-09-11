const API = {
    baseURL: 'https://voice-asistant-backend.onrender.com/',
    authToken: null,
    
    setAuthToken: function(token) {
        this.authToken = token;
    },
    
    getAuthToken: function() {
        return this.authToken;
    },
    
    makeRequest: function(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        return fetch(`${this.baseURL}${url}`, {
            headers,
            ...options
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Request failed');
                });
            }
            return response.json();
        });
    },
    
    register: function(name, email, password) {
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    },
    
    login: function(email, password) {
        return this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    getShoppingList: function() {
        return this.makeRequest('/lists');
    },
    
    saveShoppingList: function(items) {
        return this.makeRequest('/lists', {
            method: 'POST',
            body: JSON.stringify({ items })
        });
    }
};
