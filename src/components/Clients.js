import { Link, withRouter } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'

import React from 'react'
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
