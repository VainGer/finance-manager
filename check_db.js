// Script to check database content for profile1
// Run this in the server directory context

const { MongoClient } = require('mongodb');

async function checkDatabase() {
    try {
        // You'll need to update this connection string to match your MongoDB setup
        const uri = 'mongodb://localhost:27017'; // or your MongoDB URI
        const client = new MongoClient(uri);
        
        await client.connect();
        console.log('Connected to MongoDB');
        
        // Assuming your database name - you might need to adjust this
        const db = client.db('finance-manager'); // or your actual database name
        const profilesCollection = db.collection('profiles');
        
        // Find the profile1 for user 'test'
        const profile = await profilesCollection.findOne({
            username: 'test',
            profileName: 'profile1'
        });
        
        if (profile) {
            console.log('Found profile:');
            console.log('Username:', profile.username);
            console.log('Profile Name:', profile.profileName);
            console.log('Hashed PIN:', profile.pin);
            console.log('Parent Profile:', profile.parentProfile);
            console.log('Created At:', profile.createdAt);
        } else {
            console.log('Profile not found');
            
            // List all profiles for this user
            const allProfiles = await profilesCollection.find({ username: 'test' }).toArray();
            console.log('All profiles for user "test":', allProfiles.map(p => ({
                name: p.profileName,
                pin: p.pin,
                parentProfile: p.parentProfile
            })));
        }
        
        await client.close();
    } catch (error) {
        console.error('Database error:', error);
    }
}

checkDatabase();
