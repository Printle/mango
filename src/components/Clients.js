import { DurationInput, extractParts } from './DurationInput'
import { gql, graphql } from 'react-apollo'

import { Link } from 'react-router-dom'
import React from 'react'
import { Table } from './Table'
import { compose } from 'react-apollo'
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

const RawInfo = ({ edit, children }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
)
const Info = styled(RawInfo)``
const Item = styled.tr``
const Title = styled.td``
const Gray = styled.span`
  color: gray;
  font-style: italic;
  opacity: 0.4;
`
const RawValue = ({ type, name, value, edit, onChange }) => (
  <td>
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
  </td>
)
const Value = styled(RawValue)`
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
    const { className, client, updateClient, onChange } = this.props
    const { edit } = this.state

    const { days, hours, minutes, seconds } = extractParts(client.duration)

    return (
      <div className={className}>
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
        <button onClick={edit ? this.save : this.edit}>
          {edit ? 'Gem' : 'Rediger'}
        </button>
      </div>
    )
  }
}

const ClientsGrid = graphql(
  gql`
    query clients($search: String!) {
      allClients(filter: { name_contains: $search }) {
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
          onChange={() => {
            data.refetch()
          }}
        />
      ))
    )}
  </div>
))

class RawClients extends React.Component {
  state = { search: '' }

  render() {
    const { className } = this.props
    const { search } = this.state

    return (
      <div className={className}>
        <Link to="/clients/create">Tilføj Kunde</Link>
        <input
          onChange={e => this.setState({ search: e.target.value })}
          placeholder="Søg på Kunde"
          type="search"
        />
        <ClientsGrid search={search} />
      </div>
    )
  }
}

const Client = compose(
  graphql(updateClientMutation, { name: 'updateClient' }),
)(styled(RawClient)`
  background: white;
  padding: 1em;
  margin: 1em;
  box-shadow: 0 0.2em 0.5em 0 rgba(0, 0, 0, 0.2);
  width: 22em;
`)

export const Clients = styled(RawClients)`
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
