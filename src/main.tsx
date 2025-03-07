import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { Provider } from 'react-redux';
import { setStore } from './store/store.ts';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://sso.keycloak.eco-track.site',
  realm: 'devrealm',
  clientId: 'eco-track',
  KeycloakResponseType: 'code',
};

export let keycloak = new Keycloak(keycloakConfig);
const store = setStore();

function refreshToken(keycloakClient: Keycloak) {
  keycloakClient.updateToken(30).catch(function (error) {
    console.log('Failed to refresh token');
    console.log(error);
  });
}

keycloak
  .init({
    onLoad: 'login-required',
    redirectUri: 'https://eco-track.site/main',
    checkLoginIframe: false,
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  })
  .then(function (authenticated) {
    console.log(keycloak.token);

    if (authenticated) {
      const root = createRoot(document.getElementById('root') as HTMLElement);
      root.render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      setInterval(function () {
        refreshToken(keycloak);
      }, 30000);
    }
  })
  .catch((error) => {
    console.log('failed to initialize');
    console.log(error);
  });
