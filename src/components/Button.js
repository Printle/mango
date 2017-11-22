// @flow

import * as React from 'react'

export const Button = ({
  children,
  primary,
  onClick,
}: {
  children?: React.Node,
  primary: boolean,
  onClick: () => void,
}) => (
  <button
    className={`btn btn-${primary ? 'primary' : 'default'}`}
    onClick={onClick}
  >
    {children}
  </button>
)
