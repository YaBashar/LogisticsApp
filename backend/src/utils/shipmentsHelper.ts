

// Validation export functions
export function validateName(sanitisedName: string) {

    if (typeof sanitisedName !== 'string') {
        throw new Error('Invalid format');
    }

    
    if (!sanitisedName || sanitisedName.length === 0) {
        throw new Error('Shipment name cannot be empty');
    }
    
    if (sanitisedName.length > 200) {
        throw new Error('Shipment name cannot exceed 200 characters');
    }
    
}

export function validateItemDescription(sanitisedDescription: string) {

    if (typeof sanitisedDescription !== 'string') {
        throw new Error('Invalid format');
    }

    if (!sanitisedDescription || sanitisedDescription.length === 0) {
        throw new Error('Item description cannot be empty');
    }
    
    if (sanitisedDescription.length > 1000) {
        throw new Error('Item description cannot exceed 1000 characters');
    }
    
}

export function validateQuantity(quantity: number) {

    if (typeof quantity !== 'number') {
        throw new Error('Invalid format');
    }

    if (!Number.isInteger(quantity)) {
        throw new Error('Quantity must be a whole number');
    }
    
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }
    
    if (quantity > 1000000) {
        throw new Error('Quantity cannot exceed 1,000,000');
    }
    
}


export function validateLocations(origin: string, destination: string): void {

    if (typeof origin !== 'string' || typeof destination !== 'string') {
        throw new Error('Invalid format');
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
        throw new Error('Origin and destination cannot be the same');
    }
}
