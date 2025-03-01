const mongoose = require('mongoose');
const Product = require('./models/product'); // Update with the correct path
const mongo_uri = 'mongodb+srv://np03cs4a220481:Thisis5%3A55@g-shop.jqnzz.mongodb.net/?retryWrites=true&w=majority&appName=G-Shop';

const INSTRUMENT_CATEGORIES = [
    'String Instruments',
    'Woodwind Instruments',
    'Brass Instruments',
    'Percussion Instruments',
    'Keyboard Instruments',
    'Electronic Instruments',
    'Traditional Instruments',
    'Accessories'
];

const sampleProducts = [
    { name: 'Acoustic Guitar', model: 'Yamaha F310', description: 'A high-quality acoustic guitar for beginners and professionals alike.', price: 199.99, category: 'String Instruments', stock: 15 },
    { name: 'Electric Violin', model: 'Stagg EVN 4/4', description: 'A sleek and modern electric violin with built-in EQ.', price: 349.99, category: 'String Instruments', stock: 8 },
    { name: 'Alto Saxophone', model: 'Yamaha YAS-280', description: 'A versatile and rich-sounding alto saxophone.', price: 999.99, category: 'Woodwind Instruments', stock: 5 },
    { name: 'Trumpet', model: 'Bach Stradivarius 180S37', description: 'A professional-level trumpet with a brilliant tone.', price: 2499.99, category: 'Brass Instruments', stock: 3 },
    { name: 'Digital Piano', model: 'Casio PX-770', description: 'A compact digital piano with weighted keys and realistic sound.', price: 699.99, category: 'Keyboard Instruments', stock: 10 },
    { name: 'Electronic Drum Kit', model: 'Roland TD-1DMK', description: 'A beginner-friendly electronic drum kit with mesh heads.', price: 799.99, category: 'Electronic Instruments', stock: 4 },
    { name: 'Bongos', model: 'Meinl FWB200', description: 'A traditional set of bongos with excellent tone.', price: 119.99, category: 'Percussion Instruments', stock: 12 },
    { name: 'Guitar Capo', model: 'Kyser Quick-Change', description: 'A durable and easy-to-use capo for acoustic and electric guitars.', price: 24.99, category: 'Accessories', stock: 25 },
    { name: 'Classical Guitar', model: 'Córdoba C5', description: 'A full-size classical guitar with nylon strings.', price: 299.99, category: 'String Instruments', stock: 10 },
    { name: 'Electric Guitar', model: 'Fender Stratocaster', description: 'A legendary electric guitar with a versatile tone.', price: 1199.99, category: 'String Instruments', stock: 7 },
    { name: 'Bass Guitar', model: 'Ibanez GSR200', description: 'A beginner-friendly bass guitar with great playability.', price: 249.99, category: 'String Instruments', stock: 6 },
    { name: 'Ukulele', model: 'Kala KA-15S', description: 'A soprano ukulele with a bright, warm tone.', price: 79.99, category: 'String Instruments', stock: 15 },
    { name: 'Mandolin', model: 'Kentucky KM-150', description: 'A solid spruce mandolin with vintage appeal.', price: 499.99, category: 'String Instruments', stock: 4 },
    { name: 'Clarinet', model: 'Buffet Crampon E11', description: 'A professional-grade wooden clarinet.', price: 1099.99, category: 'Woodwind Instruments', stock: 3 },
    { name: 'Flute', model: 'Yamaha YFL-222', description: 'A silver-plated flute ideal for students.', price: 499.99, category: 'Woodwind Instruments', stock: 6 },
    { name: 'Trombone', model: 'Bach 42BO', description: 'A symphonic tenor trombone with an F attachment.', price: 2499.99, category: 'Brass Instruments', stock: 2 },
    { name: 'French Horn', model: 'Holton H179', description: 'A double French horn with rich projection.', price: 3999.99, category: 'Brass Instruments', stock: 1 },
    { name: 'Sitar', model: 'Ravi Shankar Signature', description: 'A handcrafted sitar with detailed ornamentation.', price: 1799.99, category: 'Traditional Instruments', stock: 2 },
    { name: 'Drumsticks', model: 'Vic Firth 5A', description: 'A standard pair of drumsticks for all styles.', price: 9.99, category: 'Accessories', stock: 30 }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongo_uri, {
            dbName: 'g-shop'
        })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('Error connecting to MongoDB:', err));

        await Product.deleteMany(); // Clear existing products
        console.log('Existing products removed');

        await Product.insertMany(sampleProducts);
        console.log('Database seeded with sample products');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
