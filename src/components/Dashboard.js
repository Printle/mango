// @flow
import * as React from 'react'

// $FlowFixMe
import { compose, graphql } from 'react-apollo'
import type {
  dashboardQuery,
  jobQuery,
  updateJobMutation,
  updateJobMutationVariables,
  updatePrintJobQuantityMutationVariables,
  updatePrintJobStatusMutationVariables,
} from '../gql'

import Timeline from 'react-calendar-timeline'
import gql from 'graphql-tag'
import moment from 'moment'
import styled from 'styled-components'

const POLL_INTERVAL = 1000

const DashboardJobFragment = gql`
  fragment DashboardJob on PrintJob {
    id
    createdAt
    quantity
    scheduledTime
    status
    model {
      id
      duration
      name
      supportedPrinters {
        id
      }
    }
    client {
      id
      name
    }
  }
`
const DashboardPrinterFragment = gql`
  ${DashboardJobFragment}

  fragment DashboardPrinter on Printer {
    id
    name
    jobs {
      ...DashboardJob
    }
  }
`

const PrintersQuery = gql`
  ${DashboardPrinterFragment}

  query dashboard {
    allPrinters {
      ...DashboardPrinter
    }
  }
`

const UPDATE_JOB_MUTATION = gql`
  mutation updateJob(
    $id: ID!
    $printerId: ID
    $scheduledTime: DateTime
    $status: PrintJobStatus
    $quantity: Int
  ) {
    updatePrintJob(
      id: $id
      printerId: $printerId
      scheduledTime: $scheduledTime
      status: $status
      quantity: $quantity
    ) {
      id
    }
  }
`

const PrintersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  width: 100%;

  > div {
    width: 100%;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
  }

  .react-calendar-timeline .rct-items .rct-item.not-printalbe {
    background: red;
  }
`

class Printers extends React.Component<
  {
    printers: Query<dashboardQuery>,
    updateJob: (args: { variables: updateJobMutationVariables }) => Promise<
      void,
    >,
  },
  { selectedJobId: void | string },
> {
  state = {
    selectedJobId: void 0,
  }

  allPrinters = () => this.props.printers.allPrinters

  allJobs = () => this.allPrinters().reduce((a, b) => a.concat(b.jobs), [])

  printers = () =>
    this.allPrinters().map(printer => ({
      id: printer.id,
      title: printer.name,
    }))

  jobs = () =>
    this.allPrinters()
      .map(printer =>
        (printer.jobs || []).map(job => ({
          id: job.id,
          group: printer.id,
          title: `${job.model.name} - ${job.status} - ${job.quantity}`,
          canMove: job.status === 'WAITING',
          start_time: moment(job.scheduledTime || job.createdAt),
          end_time: moment(job.scheduledTime || job.createdAt).add(
            job.model.duration * job.quantity,
          ),
          className:
            (job.model.supportedPrinters || [])
              .map(({ id }) => id)
              .indexOf(printer.id) > -1
              ? ''
              : 'not-printalbe',
          itemProps: {
            isPrintableOnCurrentPrinter:
              (job.model.supportedPrinters || [])
                .map(({ id }) => id)
                .indexOf(printer.id) > -1,
          },
        })),
      )
      .reduce((a, b) => a.concat(b), [])

  updateJob = async (id, start, gi) => {
    const variables = {
      id,
      scheduledTime: new Date(start).toISOString(),
      printerId: this.printers()[gi].id,
    }

    await this.props.updateJob({ variables })

    this.onChange()
  }

  onChange = () => this.props.printers.refetch()

  selectJob = selectedJobId => this.setState({ selectedJobId })

  render() {
    const { printers } = this.props
    const { selectedJobId } = this.state

    return (
      <PrintersContainer>
        {printers.loading ? (
          <h2>Loading dashboard... </h2>
        ) : (
          <div>
            <Timeline
              groups={this.printers()}
              items={this.jobs()}
              defaultTimeStart={moment().add(-12, 'hour')}
              defaultTimeEnd={moment().add(12, 'hour')}
              onItemMove={this.updateJob}
              stackItems={true}
              onItemSelect={this.selectJob}
              itemHeightRatio={1}
            />
            {selectedJobId && (
              <SelectedJob onChange={this.onChange} id={selectedJobId} />
            )}
          </div>
        )}
      </PrintersContainer>
    )
  }
}

type Query<T> = T & { loading: boolean, refetch: () => void }

const SelectedJob = compose(
  graphql(
    gql`
      query job($id: ID!) {
        PrintJob(id: $id) {
          id
          status
          quantity
          client {
            id
            name
          }
        }
      }
    `,
    {
      name: 'job',
      options: {
        pollInterval: POLL_INTERVAL,
      },
    },
  ),
  graphql(
    gql`
      mutation updatePrintJobStatus($id: ID!, $status: PrintJobStatus!) {
        updatePrintJob(id: $id, status: $status) {
          id
        }
      }
    `,
    {
      name: 'updateJobStatus',
    },
  ),
  graphql(
    gql`
      mutation updatePrintJobQuantity($id: ID!, $quantity: Int!) {
        updatePrintJob(id: $id, quantity: $quantity) {
          id
        }
      }
    `,
    {
      name: 'updateJobQuantity',
    },
  ),
)(
  ({
    job,
    updateJobStatus,
    updateJobQuantity,
    onChange,
  }: {
    job: Query<jobQuery>,
    onChange: () => void,
    updateJobStatus: (args: {
      variables: updatePrintJobStatusMutationVariables,
    }) => Promise<void>,
    updateJobQuantity: (args: {
      variables: updatePrintJobQuantityMutationVariables,
    }) => Promise<void>,
  }) => {
    if (job.loading || !job.PrintJob) return <h3>Loading</h3>

    const { id, status, quantity } = job.PrintJob

    return (
      <div>
        <label>Status</label>
        <select
          value={status}
          onChange={async e => {
            const variables = { id, status: e.target.value }
            await updateJobStatus({ variables })
            job.refetch()
            onChange()
          }}
        >
          {['WAITING', 'LOCKED', 'PRINTING', 'FINISHED', 'CANCELLED'].map(s => (
            <option value={s} key={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          key={id}
          min={1}
          max={10}
          type="number"
          defaultValue={quantity}
          onChange={async e => {
            const variables = { id, quantity: parseInt(e.target.value, 10) }
            await updateJobQuantity({ variables })
            job.refetch()
            onChange()
          }}
        />
      </div>
    )
  },
)

export const Dashboard = compose(
  graphql(UPDATE_JOB_MUTATION, { name: 'updateJob' }),
  graphql(PrintersQuery, {
    name: 'printers',
    options: {
      pollInterval: POLL_INTERVAL,
    },
  }),
)(Printers)
