// Debug script to check what PIN is stored for profile1
const bcrypt = require('bcrypt');

// Common PINs to test
const testPins = ['0000', '1111', '1234', '2222', '3333', '4444', '5555', '9999', '0123', '4321'];

// This would be the hashed PIN from the database
// You'd need to get this from your MongoDB collection
console.log('Testing common PINs against bcrypt hash...');

// Example of how to test a PIN
async function testPin(plainPin, hashedPin) {
    const isValid = await bcrypt.compare(plainPin, hashedPin);
    console.log(`PIN "${plainPin}": ${isValid ? 'VALID' : 'invalid'}`);
    return isValid;
}

// Example usage:
async function testCommonPins(hashedPin) {
    console.log('Testing common PINs...');
    for (const pin of testPins) {
        const isValid = await testPin(pin, hashedPin);
        if (isValid) {
            console.log(`✅ Found correct PIN: ${pin}`);
            return pin;
        }
    }
    console.log('❌ None of the common PINs matched');
    return null;
}

// Hash some test PINs to see what they look like
async function hashTestPins() {
    console.log('\nHashed versions of common PINs:');
    for (const pin of ['1234', '0000', '1111']) {
        const hashed = await bcrypt.hash(pin, 10);
        console.log(`PIN "${pin}": ${hashed}`);
    }
}

hashTestPins();

// To use this with your actual database hash:
// testCommonPins('$2b$10$your_actual_hash_from_database');
