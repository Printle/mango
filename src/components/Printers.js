import { Link, withRouter } from 'react-router-dom'
import { gql, graphql } from 'react-apollo'

import React from 'react'
import styled from 'styled-components'

const PrintersQuery = gql`
  query printers {
    allPrinters {
      id
      name
    }
  }
`

const UnstyledPrinters = graphql(PrintersQuery)(
  props =>
    props.data.loading ? null : (
      <div className={props.className}>
        <ul>
          {props.data.allPrinters.map(printer => (
            <li key={printer.id}>{printer.name}</li>
          ))}
        </ul>
        <Link to="/printers/add">Tilføj printer</Link>
      </div>
    ),
)

export const Printers = styled(UnstyledPrinters)`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
`
