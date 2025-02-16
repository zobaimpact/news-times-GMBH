import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/configureStore";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
