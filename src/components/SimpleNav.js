import { NavLink } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

export const SimpleNav = ({ className }) => (
  <StyledNav>
    <NavLink exact to="/">
      Hjem
    </NavLink>
    <NavLink to="/jobs">Print Jobs</NavLink>
    <NavLink to="/printers">Printere</NavLink>
    <NavLink to="/models">Modeller</NavLink>
    <NavLink to="/clients">Kunder</NavLink>
  </StyledNav>
)

export const StyledNav = styled.nav`
  padding: 1em;
  a {
    padding: 1em;
    text-decoration: none;
    &:not(.active) {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`
