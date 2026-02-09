// Script to generate correct password hashes for mock users
async function hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `$sha256$${salt}$${hashHex}`;
}

const SALTS = {
    farmer: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    manufacturer: "f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4",
    consumer: "1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d"
};

async function generateHashes() {
    console.log("Generating password hashes...\n");

    const farmer = await hashPassword("farmer123", SALTS.farmer);
    console.log("Farmer (password: farmer123):");
    console.log(farmer);
    console.log();

    const manufacturer = await hashPassword("manufacturer123", SALTS.manufacturer);
    console.log("Manufacturer (password: manufacturer123):");
    console.log(manufacturer);
    console.log();

    const consumer = await hashPassword("consumer123", SALTS.consumer);
    console.log("Consumer (password: consumer123):");
    console.log(consumer);
}

generateHashes().catch(console.error);
