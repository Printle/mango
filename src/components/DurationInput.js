import * as React from 'react'

import styled from 'styled-components'

export const MILLI = 1
export const SECONDS = MILLI * 1000
export const MINUTES = SECONDS * 60
export const HOURS = MINUTES * 60
export const DAYS = HOURS * 24

export const extractParts = x => ({
  days: Math.floor(x / DAYS),
  hours: Math.floor((x % DAYS) / HOURS),
  minutes: Math.floor((x % HOURS) / MINUTES),
  seconds: Math.floor((x % MINUTES) / SECONDS),
})

class RawDurationInput extends React.Component {
  constructor(props) {
    super()

    this.state = props.defaultValue
      ? extractParts(props.defaultValue)
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
  }

  update = field => e => {
    this.setState(
      { [field]: parseInt(e.target.value, 10) },
      () => this.props.onChange && this.props.onChange(this.durationInMillis()),
    )
  }

  durationInMillis = () =>
    this.state.days * DAYS +
    this.state.hours * HOURS +
    this.state.minutes * MINUTES +
    this.state.seconds * SECONDS

  render() {
    const { className, name } = this.props
    const { days, hours, minutes, seconds } = this.state

    return (
      <div className={className}>
        <div>
          <span>D</span>
          <Input
            type="number"
            min={0}
            value={days}
            onChange={this.update('days')}
          />
        </div>
        <div>
          <span>H</span>
          <Input
            type="number"
            min={0}
            value={hours}
            onChange={this.update('hours')}
          />
        </div>
        <div>
          <span>M</span>
          <Input
            type="number"
            min={0}
            value={minutes}
            onChange={this.update('minutes')}
          />
        </div>
        <div>
          <span>S</span>
          <Input
            type="number"
            min={0}
            value={seconds}
            onChange={this.update('seconds')}
          />
        </div>
        <input type="hidden" name={name} value={this.durationInMillis()} />
      </div>
    )
  }
}

const Input = styled.input`
  appearance: none;
  text-align: center;
  letter-spacing: -0.4px;
  line-height: 20px;
  padding: 10px 18px;
  width: 80px;
  background-color: rgba(96, 108, 110, 0.15);
  height: 40px;
  line-height: 20px;
  padding: 10px 10px;
  color: #606c6e;
  font-size: 30px;
  outline: 0 solid transparent;
  border: 0 solid transparent;
  border-radius: 4px;
`

export const DurationInput = styled(RawDurationInput)`
  display: flex;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`
