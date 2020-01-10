import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./pages/Routes";
import * as serviceWorker from "./serviceWorker";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

//Redux
import { Provider } from "react-redux";
import { Store } from "redux";
import configureStore from "./redux/Store";
import { IApplicationState } from "./redux/Store";

interface IProps {
  store: Store<IApplicationState>;
}

const App: React.SFC<IProps> = props => {
  return (
    <Provider store={props.store}>
      <Routes />
    </Provider>
  );
};

const store = configureStore();

ReactDOM.render(<App store={store} />, document.getElementById("root"));

serviceWorker.unregister();
