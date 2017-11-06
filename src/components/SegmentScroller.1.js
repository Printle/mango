import * as React from 'react'

import styled from 'styled-components'

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined'

const range = x => new Array(x).fill(0).map((_, i) => i)

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
  canGoRight = () => this.state.scroll < (this.props.max || 10) - 2

  performScroll = () => {
    const goLeft = this.scroller.scrollLeft < this.scroller.clientWidth * 4 / 2

    if (goLeft && !this.canGoLeft()) return
    if (!goLeft && !this.canGoRight()) return

    const i = goLeft ? 1 : -1

    this.setState(state => ({ scroll: state.scroll - i }))
    requestAnimationFrame(
      () => (this.scroller.scrollLeft += i * this.scroller.clientWidth * 4 / 3),
    )
  }

  handleScroll = () => {
    const doJump =
      this.scroller.scrollLeft + this.scroller.clientWidth <
        this.scroller.clientWidth * 4 / 3 ||
      this.scroller.scrollLeft > this.scroller.clientWidth * 4 / 3 * 2

    if (doJump) this.performScroll()
  }

  assignScroller = scroller => (this.scroller = scroller)

  render() {
    const { children, className } = this.props
    const { scroll, daysToShow } = this.state
    return (
      <div
        className={className}
        onScroll={!hasIntersectionObserver && this.handleScroll}
        ref={this.assignScroller}
      >
        <div>
          <div />
          <div ref={this.observe} />
          <div />
        </div>
        <div>
          {range(3).map(i => {
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
    width: 400%;
    > div {
      width: 100%;
    }
  }
`
