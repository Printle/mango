// @flow

import * as React from 'react'

import { DurationInput, extractParts } from './DurationInput'

import { Button } from './Button'
import { Link } from 'react-router-dom'
import { SearchInput } from './SearchInput'
import { Table } from './Table'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
// $FlowFixMe
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const updateModelMutation = gql`
  mutation updateModel(
    $modelId: ID!
    $supportedPrintersIds: [ID!]
    $duration: Int
    $name: String
  ) {
    updateModel(
      id: $modelId
      supportedPrintersIds: $supportedPrintersIds
      duration: $duration
      name: $name
    ) {
      id
    }
  }
`

const supportPrinterMutation = gql`
  mutation addPrinterSupport($printerId: ID!, $modelId: ID!) {
    addToSupportedModels(
      supportedPrintersPrinterId: $printerId
      supportedModelsModelId: $modelId
    ) {
      supportedModelsModel {
        id
      }
    }
  }
`

const removePrinterSupportMutation = gql`
  mutation removePrinterSupport($printerId: ID!, $modelId: ID!) {
    removeFromSupportedModels(
      supportedPrintersPrinterId: $printerId
      supportedModelsModelId: $modelId
    ) {
      supportedModelsModel {
        id
      }
    }
  }
`

const RawModelContainer = styled.div`
  background: white;
  padding: 1em;
  margin: 1em;
  box-shadow: 0 0.2em 0.5em 0 rgba(0, 0, 0, 0.2);
  width: 22em;
`

class RawModel extends React.Component<any, { showAddPrinters: boolean }> {
  state = {
    showAddPrinters: false,
  }

  showAddPrinters = () => this.setState({ showAddPrinters: true })
  hideAddPrinters = () => this.setState({ showAddPrinters: false })

  render() {
    const {
      model,
      printers,
      removePrinterSupport,
      supportPrinter,
      updateModel,
      onChange,
    } = this.props
    const { showAddPrinters } = this.state

    const { days, hours, minutes, seconds } = extractParts(model.duration)

    return (
      <RawModelContainer>
        <h2>{model.name}</h2>
        <div>
          Print Tid:{' '}
          {showAddPrinters ? (
            <DurationInput
              defaultValue={model.duration}
              onChange={async duration => {
                // console.log({ duration })
                await updateModel({
                  variables: { duration, modelId: model.id },
                })
                onChange()
              }}
            />
          ) : (
            [
              [days, 'dag'],
              [hours, 'timer'],
              [minutes, 'min'],
              [seconds, 'sek'],
            ]
              .filter(a => a[0])
              .map(([n, a]) => `${n} ${a}`)
              .join(' og ')
          )}
        </div>
        <div>
          <h3>Understøttere printere</h3>
          {showAddPrinters ? (
            <div>
              <Table>
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>X</th>
                  </tr>
                </thead>
                <tbody>
                  {printers.map(printer => {
                    const isSupported = model.supportedPrinters.reduce(
                      (isSupported, p) => isSupported || p.id === printer.id,
                      false,
                    )
                    return (
                      <tr key={printer.id}>
                        <td>
                          <Link to={`/printers/${printer.id}`}>
                            {printer.name}
                          </Link>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            defaultChecked={isSupported}
                            onChange={async e => {
                              const variables = {
                                printerId: printer.id,
                                modelId: model.id,
                              }

                              if (e.target.checked) {
                                await supportPrinter({ variables })
                              } else {
                                await removePrinterSupport({ variables })
                              }

                              onChange()
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Button onClick={this.hideAddPrinters}>Færdig</Button>
            </div>
          ) : (
            <div>
              {model.supportedPrinters.length === 0 ? (
                <p>Ingen...</p>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Navn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.supportedPrinters.map(printer => (
                      <tr key={printer.id}>
                        <td>
                          <Link to={`/printers/${printer.id}`}>
                            {printer.name}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <Button onClick={this.showAddPrinters}>Rediger</Button>
            </div>
          )}
        </div>
      </RawModelContainer>
    )
  }
}

const ModelsGrid = graphql(
  gql`
    query models($search: String!) {
      allModels(filter: { name_contains: $search }) {
        id
        name
        duration
        supportedPrinters {
          id
          name
        }
      }
      allPrinters {
        id
        name
      }
    }
  `,
  {
    options: {
      fetchPolicy: 'cache-first',
    },
  },
)(({ data }) => (
  <div className="models">
    {data.loading ? (
      <span>Loading...</span>
    ) : data.error ? (
      <span>Error {JSON.stringify(data.error)}</span>
    ) : (
      data.allModels.map(model => (
        <Model
          key={model.id}
          model={model}
          printers={data.allPrinters}
          onChange={() => {
            data.refetch()
          }}
        />
      ))
    )}
  </div>
))

export class Models extends React.Component<{}, { search: string }> {
  state = { search: '' }

  render() {
    const { search } = this.state

    return (
      <ModelsContainer>
        <Link to="/models/create">Tilføj model</Link>
        <SearchInput
          onChange={search => this.setState({ search })}
          placeholder="Søg på modeller"
        />
        <ModelsGrid search={search} />
      </ModelsContainer>
    )
  }
}

const Model = compose(
  graphql(updateModelMutation, { name: 'updateModel' }),
  graphql(removePrinterSupportMutation, { name: 'removePrinterSupport' }),
  graphql(supportPrinterMutation, { name: 'supportPrinter' }),
)(RawModel)

const ModelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .models {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex: 1;
  }
`
