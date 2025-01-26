import { Provider } from 'react-redux';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'src/index.css';
import store from 'src/store/store';
import ThemeProvider from 'src/theme';
import CustomRouter from 'src/routes/sections';

const App = () =>
{
  return (
    <ThemeProvider>
      <Provider store={ store }>
        <ToastContainer
          autoClose={ 2000 }
          hideProgressBar={ false }
          newestOnTop
          closeOnClick
          rtl={ false }
          pauseOnFocusLoss={ false }
          draggable
          pauseOnHover={ false }
          theme="light"
          transition={ Bounce }
        />
        <CustomRouter />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
