/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/react-core/dist/styles/base.css';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  appRenderWithAxiosInterceptorConfig,
  getToken,
  isAuthEnabled,
  UserContext,
  ServerUnavailablePage,
  KeycloakUnavailablePage,
  updateKeycloakToken
} from '@kogito-apps/consoles-common';
import ManagementConsole from './components/console/ManagementConsole/ManagementConsole';
import ManagementConsoleRoutes from './components/console/ManagementConsoleRoutes/ManagementConsoleRoutes';

const onLoadFailure = (): void => {
  ReactDOM.render(<KeycloakUnavailablePage />, document.getElementById('root'));
};

const appRender = async (ctx: UserContext) => {
  const httpLink = new HttpLink({
    uri:
      window['DATA_INDEX_ENDPOINT'] || process.env['KOGITO_DATAINDEX_HTTP_URL']
  });
  const fallbackUI = onError(({ networkError }: any) => {
    if (networkError && networkError.stack === 'TypeError: Failed to fetch') {
      // eslint-disable-next-line react/no-render-return-value
      return ReactDOM.render(
        <ManagementConsole apolloClient={client} userContext={ctx}>
          <ServerUnavailablePage
            displayName={'Management Console'}
            reload={() => window.location.reload()}
          />
        </ManagementConsole>,
        document.getElementById('root')
      );
    }
  });

  const setGQLContext = setContext((_, { headers }) => {
    if (!isAuthEnabled()) {
      return {
        headers
      };
    }
    return new Promise((resolve, reject) => {
      updateKeycloakToken()
        .then(() => {
          const token = getToken();
          resolve({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : ''
            }
          });
        })
        .catch(() => {
          reject();
        });
    });
  });

  const cache = new InMemoryCache();
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: setGQLContext.concat(fallbackUI.concat(httpLink))
  });
  ReactDOM.render(
    <ManagementConsole apolloClient={client} userContext={ctx}>
      <ManagementConsoleRoutes />
    </ManagementConsole>,
    document.getElementById('root')
  );
};

appRenderWithAxiosInterceptorConfig(
  (ctx: UserContext) => appRender(ctx),
  onLoadFailure
);
