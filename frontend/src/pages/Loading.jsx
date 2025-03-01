import { Helmet } from 'react-helmet-async';
import { Bars } from 'react-loader-spinner'; // Importing a loading spinner from a library

const LoadingPage = () => {
    return (
        <>
            <Helmet>
                <title>Loading...</title>
            </Helmet>
            <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Bars
                    height="80"
                    width="80"
                    color="#8B4513"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
                <h1>Loading, please wait...</h1>
            </div>
        </>
    );
};

export default LoadingPage;


