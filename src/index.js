import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import * as Api from 'lib/api';
import store from 'store';

//application page
import App from 'App';
import Footer from 'components/block/Footer';
import {
  HeaderContainer,
  AuthRoute
        } from 'containers';
import { privateRoutes, publicRoutes } from 'routes';

const history = createBrowserHistory();
const rootElement = document.getElementById('root');

/** interceptor적용 */
Api.errorInterceptors(store, history);

const Routers = () => (
      <div>
        <Switch>
            <Route exact path="/" component={App} />
            {
              privateRoutes.map((prop, key) => {
                return <AuthRoute path={prop.path} component={prop.component} key={key} />;
              })
            }
            {
              publicRoutes.map((prop, key) => {
                return <Route path={prop.path} component={prop.component} key={key} />;
              })
            }
        </Switch>
      </div>
);

ReactDOM.render(
  <Provider store={store}>
      <Router  history={history}>
        <div className="wrap">
          <HeaderContainer/>
                <Routers />
            <Footer/>
        </div>
    </Router>
   </Provider>
  , rootElement);
