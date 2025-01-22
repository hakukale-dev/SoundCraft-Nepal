const express = require( 'express' );
const User = require( '../models/account' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const router = express.Router();

// Login Route
router.post( '/login', async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne( { email } );
        if ( !user )
        {
            return res.status( 404 ).json( { error: 'Invalid email or password' } );
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare( password, user.password );
        if ( !isPasswordValid )
        {
            return res.status( 401 ).json( { error: 'Invalid email or password' } );
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            'secretKey', // Replace with a strong secret in production
            { expiresIn: '1h' }
        );

        res.json( { message: 'Login successful', token } );
        console.log( 'User Logged In' );
    } catch ( err )
    {
        res.status( 500 ).json( { error: 'Internal server error' } );
    }
} );

// Register Route
router.post( '/register', async ( req, res ) =>
{
    try
    {
        const { firstName, lastName, username, email, password, phoneNumber, address } = req.body;

        // Check if email or username is already taken
        const existingUser = await User.findOne( { email } );
        if ( existingUser )
        {
            return res.status( 400 ).json( { error: 'Email has already been taken' } );
        }

        const usedUsername = await User.findOne( { username } );
        if ( usedUsername )
        {
            return res.status( 400 ).json( { error: 'Username already taken' } );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash( password, 10 );

        // Create and save user
        const newUser = new User( {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
        } );

        const savedUser = await newUser.save();
        res.status( 201 ).json( { message: 'User registered successfully', user: savedUser } );
    } catch ( err )
    {
        res.status( 500 ).json( { error: 'Internal server error' } );
    }
} );

// Get User Details Route
router.get( '/user', async ( req, res ) =>
{
    const authHeader = req.headers[ 'authorization' ];
    const token = authHeader && authHeader.split( ' ' )[ 1 ];

    if ( !token ) return res.status( 401 ).json( { message: 'Access denied. Token missing.' } );

    try
    {
        // Verify JWT
        const decoded = jwt.verify( token, 'secretKey' ); // Replace with a strong secret in production

        // Fetch user details from database
        const user = await User.findById( decoded.id ).select( '-password' ); // Exclude password
        if ( !user )
        {
            return res.status( 404 ).json( { message: 'User not found.' } );
        }

        res.json( { message: 'User details retrieved successfully', user } );
    } catch ( err )
    {
        console.error( err );
        res.status( 403 ).json( { message: 'Invalid token.' } );
    }
} );



module.exports = router;
