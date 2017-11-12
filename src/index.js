import 'tachyons'
import './index.css'
import 'milligram'

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { AddPrinter } from './components/AddPrinter'
import { Clients } from './components/Clients'
import { CreateClient } from './components/CreateClient'
import { CreateJob } from './components/CreateJob'
import { CreateModel } from './components/CreateModel'
import { Dashboard } from './components/Dashboard'
import { Jobs } from './components/Jobs'
import { Models } from './components/Models'
import { Printers } from './components/Printers'
import React from 'react'
import { SimpleNav } from './components/SimpleNav'
import { render } from 'react-dom'
import styled from 'styled-components'

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj9h6x1cp37ze0111erl6ygwi',
})

const client = new ApolloClient({ networkInterface })

const Page = styled.div`
  min-height: 100vh;
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
        <div className="container">
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
