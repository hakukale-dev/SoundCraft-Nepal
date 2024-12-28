const express = require( 'express' );
const User = require( '../models/account' );

const router = express.Router();

const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

router.post( '/', async ( req, res ) =>
{
    try
    {
        const hashedPassword = await bcrypt.hash( req.body.password, 10 );
        const user = new User( { ...req.body, password: hashedPassword } );
        const savedUser = await user.save();
        res.status( 201 ).json( savedUser );
    } catch ( err )
    {
        res.status( 400 ).json( { error: err.message } );
    }
} );

router.get( '/', async ( req, res ) =>
{
    try
    {
        const users = await User.find();
        res.json( users );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} );

router.get( '/:id', async ( req, res ) =>
{
    try
    {
        const user = await User.findById( req.params.id );
        if ( !user ) return res.status( 404 ).json( { error: 'User not found' } );
        res.json( user );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} );

router.put( '/:id', async ( req, res ) =>
{
    try
    {
        const updatedUser = await User.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true } );
        if ( !updatedUser ) return res.status( 404 ).json( { error: 'User not found' } );
        res.json( updatedUser );
    } catch ( err )
    {
        res.status( 400 ).json( { error: err.message } );
    }
} );

router.delete( '/:id', async ( req, res ) =>
{
    try
    {
        const deletedUser = await User.findByIdAndDelete( req.params.id );
        if ( !deletedUser ) return res.status( 404 ).json( { error: 'User not found' } );
        res.json( { message: 'User deleted', user: deletedUser } );
    } catch ( err )
    {
        res.status( 500 ).json( { error: err.message } );
    }
} );

router.post( '/login', async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;

        const user = await User.findOne( { email } );
        if ( !user )
        {
            return res.status( 404 ).json( { error: 'Invalid email or password' } );
        }

        const isPasswordValid = await bcrypt.compare( password, user.password );
        if ( !isPasswordValid )
        {
            return res.status( 401 ).json( { error: 'Invalid email or password' } );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            'secretKey',
            {
                expiresIn: '1h',
            }
        );

        res.json( { message: 'Login successful', token } );
    } catch ( err )
    {
        res.status( 500 ).json( { error: 'Internal server error' } );
    }
} );

router.post( '/register', async ( req, res ) =>
{
    try
    {
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            phoneNumber,
            address
        } = req.body;

        const existingUser = await User.findOne( { email } );
        if ( existingUser )
        {
            return res.status( 400 ).json( {
                error: 'Email has already been taken'
            } );
        }

        const usedUsername = await User.findOne( { username } );
        if ( usedUsername )
        {
            return res.status( 400 ).json( {
                error: 'Username already taken'
            } );
        }

        const hashedPassword = await bcrypt.hash( password, 10 );

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
        res.status( 201 ).json( {
            message: 'User registered successfully', user: savedUser
        } );
    } catch ( err )
    {
        res.status( 500 ).json( {
            error: 'Internal server error'
        } );
    }
} );


module.exports = router;
