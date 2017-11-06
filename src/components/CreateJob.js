import * as React from 'react'

import { compose, gql, graphql } from 'react-apollo'

import styled from 'styled-components'

const createJobMutation = gql`
  mutation createPrintJob($clientId: ID!, $modelId: ID!, $printerId: ID!) {
    createPrintJob(
      clientId: $clientId
      modelId: $modelId
      printerId: $printerId
    ) {
      id
    }
  }
`

const createJobQuery = gql`
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
const InputGroup = styled.div`padding: 1em 0;`
const Label = styled.label`display: block;`
const Select = styled.select``
const Option = styled.option``
const Button = styled.button``

export const CreateJob = compose(
  graphql(createJobMutation, { name: 'createJob' }),
  graphql(createJobQuery, { name: 'query' }),
)(props => {
  const { query, createJob } = props

  return (
    <Form
      onSubmit={async e => {
        e.preventDefault()
        const t = e.target
        const client = t.client.value
        const printer = t.printer.value
        const model = t.model.value
        const variables = {
          clientId: client,
          modelId: model,
          printerId: printer,
        }
        await createJob({ variables })
        window.location.pathname = '/jobs'
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
            <Button type="submit">Opret</Button>
          </InputGroup>
        </div>
      )}
    </Form>
  )
})
