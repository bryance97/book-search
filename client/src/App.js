import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

//establish new link to graphql(controls how the apollo client makes a request)
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

//instaniate the Apollo Client and creates connection to API endpoint
const client = new ApolloClient({
  link: httpLink,
  //allows Apollo Client instance to cache API response data to perform request more efficiently
  cache: new InMemoryCache(),
});

function App() {
  return (
    //
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
