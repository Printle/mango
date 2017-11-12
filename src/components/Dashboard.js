import { compose, gql, graphql } from 'react-apollo'

import React from 'react'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'
import styled from 'styled-components'

const PrintersQuery = gql`
  query dashboard {
    allPrinters {
      id
      name
      jobs {
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
    }
  }
`

const updateJobMutation = gql`
  mutation updateJob(
    $id: ID!
    $printerId: ID
    $scheduledTime: DateTime
    $status: PrintJobStatus
  ) {
    updatePrintJob(
      id: $id
      printerId: $printerId
      scheduledTime: $scheduledTime
      status: $status
    ) {
      id
    }
  }
`

class UnstyledPrinters extends React.Component {
  state = {
    selectedJobId: void 0,
  }

  allPrinters = () => this.props.printers.allPrinters

  allJobs = () => this.allPrinters().reduce((a, b) => a.concat(b.jobs), [])

  groups = () =>
    this.allPrinters().map(printer => ({
      id: printer.id,
      title: printer.name,
    }))

  items = () =>
    this.allPrinters()
      .map(printer =>
        printer.jobs.map(job => ({
          id: job.id,
          group: printer.id,
          title: `${job.model.name} - ${job.status}`,
          canMove: job.status == 'WAITING',
          start_time: moment(job.scheduledTime || job.createdAt),
          end_time: moment(job.scheduledTime || job.createdAt).add(
            job.model.duration * job.quantity,
          ),
          className:
            job.model.supportedPrinters
              .map(({ id }) => id)
              .indexOf(printer.id) > -1
              ? ''
              : 'not-printalbe',
          itemProps: {
            isPrintableOnCurrentPrinter:
              job.model.supportedPrinters
                .map(({ id }) => id)
                .indexOf(printer.id) > -1,
          },
        })),
      )
      .reduce((a, b) => a.concat(b))

  updateJob = async (id, start, gi) => {
    const variables = {
      id,
      scheduledTime: new Date(start).toISOString(),
      printerId: this.groups()[gi].id,
    }

    await this.props.updateJob({ variables })

    this.props.printers.refetch()
  }

  selectJob = selectedJobId => this.setState({ selectedJobId })

  render() {
    const { className, printers } = this.props
    const { selectedJobId } = this.state

    return (
      <div className={className}>
        {printers.loading ? (
          <h2>Loading dashboard... </h2>
        ) : (
          <div>
            <Timeline
              groups={this.groups()}
              items={this.items()}
              defaultTimeStart={moment().add(-12, 'hour')}
              defaultTimeEnd={moment().add(12, 'hour')}
              onItemMove={this.updateJob}
              stackItems={true}
              onItemSelect={this.selectJob}
              itemHeightRatio={1}
            />
            {selectedJobId && <SelectedJob id={selectedJobId} />}
          </div>
        )}
      </div>
    )
  }
}

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
        pollInterval: 1000,
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
)(({ job, updateJobStatus, updateJobQuantity }) => {
  if (job.loading) return <h3>Loading</h3>

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
        }}
      >
        {['WAITING', 'LOCKED', 'PRINTING', 'FINISHED', 'CANCELLED'].map(s => (
          <option value={s} key={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        min={1}
        max={10}
        type="number"
        defaultValue={quantity}
        onChange={async e => {
          const variables = { id, quantity: parseInt(e.target.value, 10) }
          await updateJobQuantity({ variables })
          job.refetch()
        }}
      />
    </div>
  )
})

export const Dashboard = compose(
  graphql(updateJobMutation, { name: 'updateJob' }),
  graphql(PrintersQuery, { name: 'printers', options: { pollInterval: 1000 } }),
)(styled(UnstyledPrinters)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;

  > div {
    width: 100%;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
  }

  .react-calendar-timeline .rct-items .rct-item.not-printalbe {
    background: red;
  }
`)
