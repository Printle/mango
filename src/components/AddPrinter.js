// @flow

import * as React from 'react'

import { Button } from './Button'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
// $FlowFixMe
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const Form = styled.form`
  background: white;
  padding: 1em;
  box-shadow: 0em 0.3em 0.3em 0em rgba(0, 0, 0, 0.2);
`
const InputGroup = styled.div`
  padding: 1em 0;
`
const Label = styled.label`
  display: block;
`
const Input = styled.input``

const AddPrinterForm = graphql(gql`
  mutation addPrinter($name: String!) {
    createPrinter(name: $name) {
      id
    }
  }
`)(({ mutate, onAdd }) => (
  <Form
    onSubmit={async e => {
      e.preventDefault()

      if (!mutate) return

      const name = e.target.name.value
      await mutate({ variables: { name } })
      onAdd()
    }}
  >
    <h1>Opret Printer</h1>
    <InputGroup>
      <Label>Navn</Label>
      <Input name="name" />
    </InputGroup>
    <InputGroup>
      <Button type="submit">Opret</Button>
    </InputGroup>
  </Form>
))

export class AddPrinter extends React.Component<
  {},
  {
    redirect: false | string,
  },
> {
  state = {
    redirect: false,
  }

  render() {
    return this.state.redirect ? (
      <Redirect to={this.state.redirect} />
    ) : (
      <AddPrinterForm
        onAdd={() => {
          this.setState({ redirect: '/printers' })
        }}
      />
    )
  }
}
