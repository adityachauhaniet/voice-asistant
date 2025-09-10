const Voice = {
    recognition: null,
    isListening: false,
    
    init: function() {
        // Check if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            document.getElementById('status').textContent = 
                "Your browser doesn't support speech recognition. Please try Chrome or Edge.";
            document.getElementById('micButton').disabled = true;
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        // Set up event listeners
        this.recognition.onresult = this.handleResult.bind(this);
        this.recognition.onerror = this.handleError.bind(this);
        this.recognition.onend = this.handleEnd.bind(this);
        
        // Set up microphone button
        document.getElementById('micButton').addEventListener('click', this.toggleListening.bind(this));
    },
    
    toggleListening: function() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    },
    
    startListening: function() {
        try {
            this.recognition.start();
            this.isListening = true;
            document.getElementById('micButton').classList.add('listening');
            document.getElementById('status').textContent = "Listening... Speak now";
        } catch (error) {
            console.error('Speech recognition error:', error);
            this.isListening = false;
            document.getElementById('micButton').classList.remove('listening');
            document.getElementById('status').textContent = "Error: " + error.message;
        }
    },
    
    stopListening: function() {
        this.recognition.stop();
        this.isListening = false;
        document.getElementById('micButton').classList.remove('listening');
        document.getElementById('status').textContent = "Speech recognition stopped";
    },
    
    handleResult: function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById('status').textContent = `Heard: "${transcript}"`;
        this.processCommand(transcript);
        this.stopListening();
    },
    
    handleError: function(event) {
        document.getElementById('status').textContent = `Error: ${event.error}`;
        this.stopListening();
    },
    
    handleEnd: function() {
        if (this.isListening) {
            this.stopListening();
        }
    },
    
    processCommand: function(command) {
        // Simple command processing - in a real app, you'd use more sophisticated NLP
        if (command.includes('add') && (command.includes('to my list') || command.includes('to the list'))) {
            let item = command.replace('add', '').replace('to my list', '').replace('to the list', '').trim();
            let quantity = '1';
            
            // Try to extract quantity
            const quantityMatch = item.match(/^(\d+)\s+/);
            if (quantityMatch) {
                quantity = quantityMatch[1];
                item = item.replace(quantityMatch[0], '').trim();
            }
            
            UI.addItem(item, quantity);
            this.speak(`Added ${quantity} ${item} to your shopping list`);
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        } 
        else if (command.includes('remove') || command.includes('delete')) {
            let item = command.replace('remove', '').replace('delete', '').trim();
            UI.removeItem(item);
            this.speak(`Removed ${item} from your shopping list`);
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        } 
        else if (command.includes('clear') && command.includes('list')) {
            UI.clearAllItems();
            this.speak('Cleared all items from your shopping list');
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        } 
        else if (command.includes('what') && command.includes('on my list')) {
            this.readList();
        }
        else if (command.includes('mark') && command.includes('as completed')) {
            let item = command.replace('mark', '').replace('as completed', '').trim();
            UI.markItemAsCompleted(item);
            this.speak(`Marked ${item} as completed`);
            
            // Save to backend if user is logged in
            if (API.getAuthToken()) {
                API.saveShoppingList(UI.getItems())
                    .catch(error => {
                        console.error('Error saving list:', error);
                    });
            }
        }
        else {
            this.speak("Sorry, I didn't understand that command. Try saying 'add milk to my list' or 'what's on my list?'");
        }
    },
    
    speak: function(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    },
    
    readList: function() {
        const items = UI.getItems().filter(item => !item.completed);
        if (items.length === 0) {
            this.speak('Your shopping list is empty');
            return;
        }
        
        let speech = 'You have the following items on your list: ';
        items.forEach((item, index) => {
            speech += `${item.quantity} of ${item.name}. `;
            if (index === items.length - 2) {
                speech += 'and ';
            }
        });
        
        this.speak(speech);
    }
};