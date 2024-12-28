import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Accounts/Login';
import Register from './pages/Accounts/Register';
import MainStore from './pages/MainStore';
import checkToken from './uitls/checkToken';

const App = () =>
{
  const [ user, setUser ] = useState( null );
  const [ loading, setLoading ] = useState( true );

  useEffect( () =>
  {
    const fetchUser = async () =>
    {
      const validatedUser = await checkToken();
      setUser( validatedUser );
      setLoading( false );
    };

    fetchUser();
  }, [] );

  if ( loading ) return <div>Loading...</div>; // Show a loader while checking token

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={ user ? <Navigate to="/" /> : <Login /> }
          />
          <Route
            path="/register"
            element={ user ? <Navigate to="/" /> : <Register /> }
          />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/about" element={ <About /> } />
                    <Route path="/contact" element={ <Contact /> } />
                    <Route path="/explore" element={ <MainStore /> } />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
