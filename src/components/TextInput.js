// @flow

import * as React from 'react'

export const TextInput = ({
  children,
  primary,
  onClick,
}: {
  children?: React.Node,
  primary: boolean,
  onClick: () => void,
}) => <input type="text" onClick={onClick} />
