// import './index.css'
// import 'milligram'
// import 'tachyons'

import * as React from 'react'

import { Route, HashRouter as Router } from 'react-router-dom'

import { AddPrinter } from './components/AddPrinter'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Clients } from './components/Clients'
import { CreateClient } from './components/CreateClient'
import { CreateJob } from './components/CreateJob'
import { CreateModel } from './components/CreateModel'
import { Dashboard } from './components/Dashboard'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Jobs } from './components/Jobs'
import { Models } from './components/Models'
import { Printers } from './components/Printers'
import { SimpleNav } from './components/SimpleNav'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { render } from 'react-dom'
import { split } from 'apollo-link'
import styled from 'styled-components'

const serviceId = process.env.REACT_APP_SERVICE_ID

const httpLink = new HttpLink({
  uri: `https://api.graph.cool/simple/v1/${serviceId}`,
})

const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.graph.cool/v1/${serviceId}`,
  options: {
    reconnect: true,
  },
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
})

const Page = styled.div`
  display: flex;
  flex-direction: column;

  > *:nth-child(2) {
    flex: 1;
    display: flex;
    justify-content: center;
  }
`

render(
  <ApolloProvider client={client}>
    <Router>
      <Page>
        <SimpleNav />
        <div>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/jobs" component={Jobs} />
          <Route path="/jobs/create" component={CreateJob} />
          <Route exact path="/printers" component={Printers} />
          <Route path="/printers/add" component={AddPrinter} />
          <Route exact path="/clients" component={Clients} />
          <Route path="/clients/create" component={CreateClient} />
          <Route exact path="/models" component={Models} />
          <Route path="/models/create" component={CreateModel} />
        </div>
      </Page>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
