// @flow
import * as React from 'react'

import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
// $FlowFixMe
import { graphql } from 'react-apollo'
import styled from 'styled-components'

export const Printers = graphql(
  gql`
    query printers {
      allPrinters {
        id
        name
      }
    }
  `,
  {
    options: {
      pollInterval: 1000,
    },
  },
)(
  props =>
    !props.data || props.data.loading ? null : (
      <PrintersContainer>
        {props.data.allPrinters.map(printer => (
          <div key={printer.id}>{printer.name}</div>
        ))}
        <Link to="/printers/add">Tilføj printer</Link>
      </PrintersContainer>
    ),
)

export const PrintersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
