const { parseVoiceCommand } = require('./helpers');

// Process voice command and return appropriate response
exports.processVoiceCommand = (command) => {
    const parsed = parseVoiceCommand(command);
    
    switch (parsed.action) {
        case 'add':
            return {
                action: 'add',
                items: parsed.items.map((item, index) => ({
                    name: item,
                    quantity: parsed.quantities[index] || '1'
                }))
            };
        
        case 'remove':
            return {
                action: 'remove',
                items: parsed.items
            };
        
        case 'complete':
            return {
                action: 'complete',
                items: parsed.items
            };
        
        case 'clear':
            return {
                action: 'clear'
            };
        
        case 'read':
            return {
                action: 'read'
            };
        
        default:
            return {
                action: 'unknown',
                message: "Sorry, I didn't understand that command."
            };
    }
};