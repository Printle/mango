import * as React from 'react'

import { gql, graphql } from 'react-apollo'

import { DurationInput } from './DurationInput'
import styled from 'styled-components'

const createModelMutation = gql`
  mutation createModel($duration: Int!, $name: String!) {
    createModel(duration: $duration, name: $name) {
      id
    }
  }
`

const Form = styled.form`
  background: white;
  padding: 1em;
  box-shadow: 0em 0.3em 0.3em 0em rgba(0, 0, 0, 0.2);
`
const InputGroup = styled.div`padding: 1em 0;`
const Label = styled.label`display: block;`
const Input = styled.input``
const Button = styled.button``

export const CreateModel = graphql(createModelMutation)(({ mutate }) => (
  <Form
    onSubmit={async e => {
      e.preventDefault()
      const target = e.target

      const name = target.name.value
      const duration = parseInt(target.duration.value, 0)
      await mutate({ variables: { name, duration } })
      window.location.pathname = '/models'
    }}
  >
    <h1>Opret Model</h1>
    <InputGroup>
      <Label>Navn</Label>
      <Input type="text" name="name" />
    </InputGroup>
    <InputGroup>
      <Label>Print tid</Label>
      <DurationInput name="duration" />
    </InputGroup>
    <InputGroup>
      <Button type="submit">Opret</Button>
    </InputGroup>
  </Form>
))
