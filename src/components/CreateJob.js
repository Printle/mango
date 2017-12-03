// @flow

import * as React from 'react'

// $FlowFixMe
import { compose, graphql } from 'react-apollo'
import type { createJobQuery, createPrintJobMutationVariables } from '../gql'

import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import styled from 'styled-components'

const CREATE_JOB_MUTATION = gql`
  mutation createPrintJob(
    $clientId: ID!
    $modelId: ID!
    $printerId: ID!
    $quantity: Int
  ) {
    createPrintJob(
      clientId: $clientId
      modelId: $modelId
      printerId: $printerId
      quantity: $quantity
    ) {
      id
    }
  }
`

const CREATE_JOB_QUERY = gql`
  query createJob {
    allClients {
      id
      name
    }
    allPrinters {
      id
      name
    }
    allModels {
      id
      name
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
const Select = styled.select``
const Option = styled.option``
const Button = styled.button``

const CreateJobForm = compose(
  graphql(CREATE_JOB_MUTATION, { name: 'createJob' }),
  graphql(CREATE_JOB_QUERY, { name: 'query' }),
)(
  (props: {
    query: createJobQuery,
    createJob: (args: {
      variables: createPrintJobMutationVariables,
    }) => Promise<{}>,
    onCreate: () => any,
  }) => {
    const { query, createJob, onCreate } = props

    return (
      <Form
        onSubmit={async e => {
          e.preventDefault()
          const t = e.target
          const client = t.client.value
          const printer = t.printer.value
          const model = t.model.value
          const quantity = parseInt(t.quantity.value, 10) || 1
          const variables = {
            clientId: client,
            modelId: model,
            quantity: quantity,
            printerId: printer,
          }
          await createJob({ variables })
          onCreate()
        }}
      >
        <h1>Opret Print Job</h1>
        {query.loading ? (
          <h2>Loading...</h2>
        ) : (
          <div>
            <InputGroup>
              <Label>Kunde</Label>
              <Select name="client">
                {query.allClients.map(client => (
                  <Option key={client.id} value={client.id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Model</Label>
              <Select name="model">
                {query.allModels.map(model => (
                  <Option key={model.id} value={model.id}>
                    {model.name}
                  </Option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Printer</Label>
              <Select name="printer">
                {query.allPrinters.map(printer => (
                  <Option key={printer.id} value={printer.id}>
                    {printer.name}
                  </Option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Antal</Label>
              <input name="quantity" type="number" defaultValue={1} min={0} />
            </InputGroup>
            <InputGroup>
              <Button type="submit">Opret</Button>
            </InputGroup>
          </div>
        )}
      </Form>
    )
  },
)

export class CreateJob extends React.Component<
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
      <CreateJobForm
        onCreate={() => {
          this.setState({ redirect: '/jobs' })
        }}
      />
    )
  }
}
