// @flow

import * as React from 'react'

export const Button = ({
  children,
  primary,
  onClick,
  type,
}: {
  children?: React.Node,
  primary?: boolean,
  onClick?: () => void,
  type?: 'submit',
}) => (
  <button
    type={type}
    className={`btn btn-${primary ? 'primary' : 'default'}`}
    onClick={onClick}
  >
    {children}
  </button>
)
