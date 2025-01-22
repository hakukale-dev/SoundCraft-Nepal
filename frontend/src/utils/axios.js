import axios from 'axios';

export default function axiosInstance ( token = null )
{
    const data = {
        baseURL: 'http://localhost:8080/',
    };

    if ( token )
    {
        data.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return axios.create( data );
}