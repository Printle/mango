import * as React from 'react'

import { gql, graphql } from 'react-apollo'

import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ClientsQuery = gql`
  query clients {
    allClients {
      id
      name
    }
  }
`

const UnstyledClients = graphql(ClientsQuery)(
  props =>
    props.data.loading ? null : (
      <div className={props.className}>
        <ul>
          {props.data.allClients.map(printer => (
            <li key={printer.id}>{printer.name}</li>
          ))}
        </ul>
        <Link to="/clients/create">Tilføj Kunde</Link>
      </div>
    ),
)

export const Clients = styled(UnstyledClients)`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
`
