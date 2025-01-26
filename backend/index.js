const express = require( 'express' )
const app = express();


const cors = require( 'cors' );
app.use( cors() );

app.use( express.json() );

const authRoutes = require( './routes/authRoutes' );
const accountRoutes = require( './routes/accountRoutes' );
const productRoutes = require( './routes/productRoutes' );

const mongoose = require( "mongoose" )
mongoose.connect( 'mongodb://localhost:27017/g-shop' )
	.then( () => console.log( 'MongoDB connected' ) )
	.catch( err => console.error( 'Error connecting to MongoDB:', err ) );

app.use( '/api/auth', authRoutes );
app.use( '/api/account', accountRoutes );
app.use( '/api/products', productRoutes );

// Start the server
const PORT = 8080;
app.listen( PORT, () =>
{
	console.log( `Server running on http://localhost:${PORT}` );
} );