import React from 'react'
import styled from 'styled-components'

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined'

export const range = x => new Array(x).fill(0).map((_, i) => i)

const NUM_SEGMENTS = 7

if (NUM_SEGMENTS % 2 == 0) NUM_SEGMENTS += 1

class RawSegmentScroller extends React.Component {
  state = {
    scroll: 0,
    daysToShow: 5,
  }

  observer = hasIntersectionObserver &&
    new IntersectionObserver(([center]) => {
      const doJump = center.intersectionRatio == 0

      if (doJump) this.performScroll()
    })

  observe = d => {
    if (d && this.observer) {
      this.observer.disconnect()
      this.observer.observe(d)
    }
  }

  canGoLeft = () => this.state.scroll > (this.props.min || 0)
  canGoRight = () => this.state.scroll < (this.props.max || 100000) - 2

  performScroll = () => {
    const goLeft =
      this.scroller.scrollLeft < this.scroller.clientWidth * NUM_SEGMENTS / 2

    if (goLeft && !this.canGoLeft()) return
    if (!goLeft && !this.canGoRight()) return

    const i = goLeft ? 1 : -1

    this.setState(state => ({ scroll: state.scroll - i }))
    requestAnimationFrame(
      () => (this.scroller.scrollLeft += i * this.scroller.clientWidth),
    )
  }

  handleScroll = () => {
    const doJump =
      this.scroller.scrollLeft + this.scroller.clientWidth <
        this.scroller.clientWidth ||
      this.scroller.scrollLeft > this.scroller.clientWidth * 2

    if (doJump) this.performScroll()
  }

  mouseUpHandler = () => {
    if (this.state.mouseDown) this.setState({ mouseDown: false })
  }

  mouseMoveHandler = e => {
    if (!this.state.mouseDown) return
    e.preventDefault()
    const n = { x: e.clientX, y: e.clientY }
    this.scroller.scrollLeft -= n.x - this.lastMouse.x
    this.lastMouse = n
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUpHandler)
    document.addEventListener('mousemove', this.mouseMoveHandler)
  }

  componentDidUnmount() {
    document.removeEventListener('mouseup', this.mouseUpHandler)
    document.removeEventListener('mousemove', this.mouseMoveHandler)
  }

  assignScroller = scroller => (this.scroller = scroller)

  render() {
    const { children, className } = this.props
    const { scroll, daysToShow, mouseDown } = this.state
    return (
      <div
        className={className}
        onScroll={!hasIntersectionObserver && this.handleScroll}
        ref={this.assignScroller}
        onMouseDown={e => {
          this.lastMouse = { x: e.clientX, y: e.clientY }
          this.setState({ mouseDown: true })
        }}
      >
        <div style={{ padding: '0 10em' }}>
          {range(Math.floor(NUM_SEGMENTS / 2)).map(i => <div key={i} />)}
          <div ref={this.observe} />
          {range(Math.ceil(NUM_SEGMENTS / 2)).map(i => <div key={i} />)}
        </div>
        <div>
          {range(NUM_SEGMENTS).map(i => {
            const n = scroll + i
            return <div key={n}>{this.props.segment(n)}</div>
          })}
        </div>
      </div>
    )
  }
}

export const SegmentScroller = styled(RawSegmentScroller)`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  width: 100%;
  > div {
    display: flex;
    width: ${NUM_SEGMENTS * 100}%;
    > div {
      width: 100%;
    }
  }
`
