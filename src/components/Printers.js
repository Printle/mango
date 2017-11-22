import { Link } from 'react-router-dom'
import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const UnstyledPrinters = graphql(gql`
  query printers {
    allPrinters {
      id
      name
    }
  }
`)(
  props =>
    !props.data || props.data.loading ? null : (
      <div className={props.className}>
        {props.data.allPrinters.map(printer => (
          <div key={printer.id}>{printer.name}</div>
        ))}
        <Link to="/printers/add">Tilføj printer</Link>
      </div>
    ),
)

export const Printers = styled(UnstyledPrinters)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
