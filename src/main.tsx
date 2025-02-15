import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store} from "./redux/store/configureStore.ts";
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
