// @flow

import type { JobPageJobFragment } from '../gql'
import { Link } from 'react-router-dom'
import React from 'react'
import { Table } from './Table'
import gql from 'graphql-tag'
// $FlowFixMe
import { graphql } from 'react-apollo'
import styled from 'styled-components'

const JobPageFragment = gql`
  fragment JobPageJob on PrintJob {
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
`

const JobsQuery = gql`
  ${JobPageFragment}

  query jobs {
    allPrintJobs {
      ...JobPageJob
    }
  }
`

export const Jobs = graphql(JobsQuery)(
  props =>
    props.data.loading ? null : (
      <JobsContainer>
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
            {props.data.allPrintJobs.map(job => <JobRow job={job} />)}
          </tbody>
        </Table>
        <Link to="/jobs/create">Tilføj job</Link>
      </JobsContainer>
    ),
)

const JobRow = ({ job }: { job: JobPageJobFragment }) => (
  <tr key={job.id}>
    <td>
      <Link to={`/clients/${job.client.id}`}>{job.client.name}</Link>
    </td>
    <td>
      <Link to={`/models/${job.model.id}`}>{job.model.name}</Link>
    </td>
    <td>
      <Link to={`/printers/${job.printer.id}`}>{job.printer.name}</Link>
    </td>
    <td>{new Date(job.createdAt).toLocaleTimeString()}</td>
    <td>
      {job.scheduledTime && new Date(job.scheduledTime).toLocaleTimeString()}
    </td>
    <td>
      {job.scheduledTime &&
        new Date(
          new Date(job.createdAt || job.scheduledTime).valueOf() +
            job.model.duration,
        ).toLocaleTimeString()}
    </td>
    <td>{job.status}</td>
  </tr>
)

const JobsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
