import * as React from 'react'

import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const RawSimpleNav: React.SFC<{ className?: string }> = ({ className }) => (
  <nav className={className}>
    <NavLink exact to="/">
      Hjem
    </NavLink>
    <NavLink to="/jobs">Print Jobs</NavLink>
    <NavLink to="/printers">Printere</NavLink>
    <NavLink to="/models">Modeller</NavLink>
    <NavLink to="/clients">Kunder</NavLink>
  </nav>
)

export const SimpleNav = styled(RawSimpleNav)`
  padding: 1em;
  a {
    padding: 1em;
    text-decoration: none;
    &:not(.active) {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`