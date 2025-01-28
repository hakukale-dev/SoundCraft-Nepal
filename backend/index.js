const express = require( 'express' )
const app = express();
const path = require('path');

const cors = require( 'cors' );
const mongo_uri = 'mongodb+srv://np03cs4a220481:Thisis5%3A55@g-shop.jqnzz.mongodb.net/?retryWrites=true&w=majority&appName=G-Shop';

app.use( cors() );

app.use( express.json() );

const authRoutes = require( './routes/authRoutes' );
const accountRoutes = require( './routes/accountRoutes' );
const productRoutes = require( './routes/productRoutes' );

const mongoose = require( "mongoose" )
mongoose.connect( mongo_uri, {
	dbName: 'g-shop'
} )
	.then( () => console.log( 'MongoDB connected' ) )
	.catch( err => console.error( 'Error connecting to MongoDB:', err ) );

app.use( '/api/auth', authRoutes );
app.use( '/api/account', accountRoutes );
app.use( '/api/products', productRoutes );

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = 8080;
app.listen( PORT, () =>
{
	console.log( `Server running on http://localhost:${PORT}` );
} );