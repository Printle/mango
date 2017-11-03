import React from 'react'
import styled from 'styled-components'

export const Table = styled.table`
  border-collapse: collapse;
  margin: 0.3em 0;
  td,
  th {
    padding: 0.125em 0.5em 0.25em 0.5em;
    line-height: 1;
    text-align: left;
  }
  thead {
    border-bottom: 1px solid orange;
  }
`
