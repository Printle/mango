import { DurationInput } from './DurationInput'
import React from 'react'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
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
const InputGroup = styled.div`
  padding: 1em 0;
`
const Label = styled.label`
  display: block;
`
const Input = styled.input``
const Button = styled.button``

const CreateModelForm = graphql(createModelMutation)(({ mutate, onCreate }) => (
  <Form
    onSubmit={async e => {
      e.preventDefault()
      const target = e.target

      const name = target.name.value
      const duration = parseInt(target.duration.value, 0)
      await mutate({ variables: { name, duration } })
      onCreate()
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

export class CreateModel extends React.Component<
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
      <CreateModelForm
        onCreate={() => {
          this.setState({ redirect: '/models' })
        }}
      />
    )
  }
}
