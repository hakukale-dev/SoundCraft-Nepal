import axios from 'axios';

const checkToken = async () =>
{
    const token = localStorage.getItem( 'token' );
    if ( !token ) return null;

    try
    {
        const response = await axios.get( '/api/validate-token', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } );
        return response.data.user;
    } catch ( error )
    {
        console.error( 'Invalid token:', error.response?.data?.message || error.message );
        localStorage.removeItem( 'token' );
        return null;
    }
};

export default checkToken;
