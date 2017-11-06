import * as React from 'react'

import { gql, graphql } from 'react-apollo'

import { Link } from 'react-router-dom'
import { Table } from './Table'
import styled from 'styled-components'

const JobsQuery = gql`
  query jobs {
    allPrintJobs {
      id
      createdAt
      scheduledTime
      status
      client {
        id
        name
      }
      model {
        id
        name
        duration
      }
      printer {
        id
        name
      }
    }
  }
`

const UnstyledJobs = graphql(JobsQuery)(
  props =>
    props.data.loading ? null : (
      <div className={props.className}>
        <Table>
          <thead>
            <tr>
              <th>Kunde</th>
              <th>Model</th>
              <th>Printer</th>
              <th>Oprettet</th>
              <th>Planlagt</th>
              <th>Færdig</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {props.data.allPrintJobs.map(job => (
              <tr key={job.id}>
                <td>
                  <Link to={`/clients/${job.client.id}`}>
                    {job.client.name}
                  </Link>
                </td>
                <td>
                  <Link to={`/models/${job.model.id}`}>{job.model.name}</Link>
                </td>
                <td>
                  <Link to={`/printers/${job.printer.id}`}>
                    {job.printer.name}
                  </Link>
                </td>
                <td>{new Date(job.createdAt).toLocaleTimeString()}</td>
                <td>{new Date(job.scheduledTime).toLocaleTimeString()}</td>
                <td>
                  {new Date(
                    new Date(job.createdAt || job.scheduledTime).valueOf() +
                      job.model.duration,
                  ).toLocaleTimeString()}
                </td>
                <td>{job.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link to="/jobs/create">Tilføj job</Link>
      </div>
    ),
)

export const Jobs = styled(UnstyledJobs)`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
`
