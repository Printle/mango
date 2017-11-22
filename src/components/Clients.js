import { DurationInput, extractParts } from './DurationInput'

import { Button } from './Button'
import { Link } from 'react-router-dom'
import React from 'react'
import { SearchInput } from './SearchInput'
import { Table } from './Table'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const updateClientMutation = gql`
  mutation updateClient(
    $id: ID!
    $name: String
    $tel: String
    $email: String
    $contactPerson: String
    $address: String
  ) {
    updateClient(
      id: $id
      name: $name
      tel: $tel
      email: $email
      contactPerson: $contactPerson
      address: $address
    ) {
      id
    }
  }
`

const Info = ({ edit, children }) => (
  <InfoTable>
    <tbody>{children}</tbody>
  </InfoTable>
)
const InfoTable = styled.table``
const Item = styled.tr``
const Title = styled.td``
const Gray = styled.span`
  color: gray;
  font-style: italic;
  opacity: 0.4;
`
const Value = ({ type, name, value, edit, onChange }) => (
  <ValueCell>
    {edit ? (
      <input
        type={type}
        name={name}
        defaultValue={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      value || <Gray>Tom</Gray>
    )}
  </ValueCell>
)
const ValueCell = styled.td`
  > input {
    margin: 0;
  }
`

class RawClient extends React.Component {
  state = {
    edit: false,
  }

  edit = () => this.setState({ edit: true })
  save = () => this.setState({ edit: false })

  change = field => async value => {
    const variables = { id: this.props.client.id, [field]: value }
    await this.props.updateClient({ variables })
    this.props.onChange()
    this.props.client.refetch()
  }

  render() {
    const {
      className,
      client,
      updateClient,
      onChange,
      deleteClient,
    } = this.props
    const { edit } = this.state

    const { days, hours, minutes, seconds } = extractParts(client.duration)

    return (
      <ClientContainer>
        <h2>{client.name}</h2>
        <p>Jobs: {client.jobs.length}</p>
        <Info>
          <Item>
            <Title>Tel</Title>
            <Value
              onChange={this.change('tel')}
              edit={edit}
              type="tel"
              name="tel"
              value={client.tel}
            />
          </Item>
          <Item>
            <Title>Email</Title>
            <Value
              onChange={this.change('email')}
              edit={edit}
              type="email"
              name="email"
              value={client.email}
            />
          </Item>
          <Item>
            <Title>Kontact Person</Title>
            <Value
              onChange={this.change('contactPerson')}
              edit={edit}
              type="text"
              name="contactPerson"
              value={client.contactPerson}
            />
          </Item>
          <Item>
            <Title>Address</Title>
            <Value
              onChange={this.change('address')}
              edit={edit}
              type="text"
              name="address"
              value={client.address}
            />
          </Item>
        </Info>
        <Button onClick={edit ? this.save : this.edit}>
          {edit ? 'Gem' : 'Rediger'}
        </Button>
        {edit && <Button onClick={deleteClient}>Slet</Button>}
      </ClientContainer>
    )
  }
}

const ClientFragment = gql`
  fragment ClientFragment on Client {
    id
    name
    jobs {
      id
    }
    tel
    email
    contactPerson
    address
  }
`

const ClientsGrid = graphql(
  gql`
    ${ClientFragment}

    query clients($search: String!) {
      allClients(filter: { name_contains: $search, deleted: false }) {
        ...ClientFragment
      }
    }
  `,
  {
    options: {
      fetchPolicy: 'cache-first',
    },
  },
)(({ data }) => (
  <div className="clients">
    {data.loading ? (
      <span>Loading...</span>
    ) : data.error ? (
      <span>Error {JSON.stringify(data.error)}</span>
    ) : (
      data.allClients.map(client => (
        <Client
          key={client.id}
          client={client}
          printers={data.allPrinters}
          deleteClient={() => {}}
          onChange={() => {
            data.refetch()
          }}
        />
      ))
    )}
  </div>
))

export class Clients extends React.Component {
  state = { search: '' }

  render() {
    const { className } = this.props
    const { search } = this.state

    return (
      <ClientsContainer>
        <Link to="/clients/create">Tilføj Kunde</Link>
        <SearchInput
          onChange={search => this.setState({ search })}
          placeholder="Søg på Kunde"
        />
        <ClientsGrid search={search} />
      </ClientsContainer>
    )
  }
}

const ClientContainer = styled.div`
  background: white;
  padding: 1em;
  margin: 1em;
  box-shadow: 0 0.2em 0.5em 0 rgba(0, 0, 0, 0.2);
  width: 22em;
`

const Client = graphql(updateClientMutation, { name: 'updateClient' })(
  RawClient,
)

export const ClientsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .clients {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex: 1;
  }
`
