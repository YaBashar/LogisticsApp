import validator from "validator";


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

export function generateOrderNumber(): number {
    const timestamp = Date.now(); 
    const lastDigits = timestamp % 100000000; // Last 8 digits as number
    return lastDigits; 
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

export function validateWeight(weight: number) {

    if (typeof weight !== 'number') {
        throw new Error('Invalid format');
    }

    if (!Number.isInteger(weight)) {
        throw new Error('weight must be a whole number');
    }
    
    if (weight < 1) {
        throw new Error('weight must be at least 1');
    }
    
    if (weight > 1000000) {
        throw new Error('weight cannot exceed 1,000,000');
    }
    
}

export function validatePhoneNumber(phoneNumber: string) {
    if (typeof phoneNumber !== 'string' ) {
        throw new Error('Invalid Phone');
    }

    if (!validator.isMobilePhone(phoneNumber)) {
        throw new Error('Invalid Phone ')
    }
}


export function validateEmail(email: string) {
    if (typeof email !== 'string') {
        throw new Error('Invalid Email');
    }

    if (!validator.isEmail(email)) {
        throw new Error('Invalid Email');
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
