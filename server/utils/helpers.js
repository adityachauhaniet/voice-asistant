// Helper function to extract items and quantities from voice commands
exports.parseVoiceCommand = (command) => {
    const result = {
        action: null,
        items: [],
        quantities: []
    };
    
    command = command.toLowerCase();
    
    // Determine action
    if (command.includes('add')) result.action = 'add';
    else if (command.includes('remove') || command.includes('delete')) result.action = 'remove';
    else if (command.includes('mark') && command.includes('complete')) result.action = 'complete';
    else if (command.includes('clear')) result.action = 'clear';
    else if (command.includes('what') && command.includes('list')) result.action = 'read';
    
    // Extract items and quantities (simplified version)
    if (result.action === 'add') {
        // Simple parsing - in a real app, you'd use more sophisticated NLP
        const addIndex = command.indexOf('add');
        let itemsText = command.substring(addIndex + 3).trim();
        
        // Remove phrases like "to my list"
        itemsText = itemsText.replace(/to (my|the) list/, '').trim();
        
        // Try to extract quantity and item
        const quantityMatch = itemsText.match(/^(\d+)\s+/);
        if (quantityMatch) {
            result.quantities.push(quantityMatch[1]);
            itemsText = itemsText.substring(quantityMatch[0].length).trim();
        } else {
            result.quantities.push('1');
        }
        
        result.items.push(itemsText);
    }
    else if (result.action === 'remove' || result.action === 'complete') {
        const actionIndex = command.indexOf('remove') || command.indexOf('delete') || 
                           (command.indexOf('mark') && command.indexOf('complete'));
        let itemsText = command.substring(actionIndex).replace('remove', '')
                            .replace('delete', '').replace('mark', '').replace('as complete', '').trim();
        
        result.items.push(itemsText);
        result.quantities.push('1');
    }
    
    return result;
};