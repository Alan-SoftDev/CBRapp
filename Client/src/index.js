import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache()
persistCache({
    cache,
    storage: localStorage
})

if (localStorage['apollo-cache-persist'])
{
    let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
    cache.restore(cacheData)
}

const httpLink = createUploadLink({ uri: 'http://localhost:4000' });
let nextLink = new ApolloLink((operation, forward) => {
        operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: (localStorage.getItem('token') || "1")
            }
        }))
    return forward(operation)
})
const link = nextLink.concat(httpLink);
const client = new ApolloClient({
    cache: cache,
    link: link
});

ReactDOM.render(<App client={client} />, document.getElementById('root'));

