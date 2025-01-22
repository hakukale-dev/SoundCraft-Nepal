import { Provider } from 'react-redux';

import CustomRoutes from './helpers/CustomRoutes';
import store from './store/store';
import { Bounce, ToastContainer } from 'react-toastify';

const App = () =>
{
  return (
    <Provider store={ store }>
      <ToastContainer
        position="bottom-right"
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

      <CustomRoutes />
    </Provider>
  );
};

export default App;
