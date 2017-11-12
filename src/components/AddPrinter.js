import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const Form = styled.form`
  background: white;
  padding: 1em;
  box-shadow: 0em 0.3em 0.3em 0em rgba(0, 0, 0, 0.2);
`
const InputGroup = styled.div`padding: 1em 0;`
const Label = styled.label`display: block;`
const Input = styled.input``
const Button = styled.button``

export const AddPrinter = graphql(gql`
  mutation addPrinter($name: String!) {
    createPrinter(name: $name) {
      id
    }
  }
`)(({ mutate }) => (
  <Form
    onSubmit={async e => {
      e.preventDefault()

      if (!mutate) return

      const name = e.target.name.value
      await mutate({ variables: { name } })
      window.location.pathname = '/printers'
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
