import { useEffect, useRef } from 'react'
import { select, max, scaleLinear, scaleBand, axisLeft, axisBottom } from 'd3';

import styles from './Chart.module.scss'

// margin convention often used with D3
const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 800 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const color = ['#f05440', '#d5433d', '#b33535', '#283250']

const Chart = ({ data }) => {
  const d3svg = useRef(null)

  useEffect(() => {
    if (data && d3svg.current) {
      let svg = select(d3svg.current)

      // scales
      const xMax = max(data, d => d.revenue)

      const xScale = scaleLinear()
        .domain([0, xMax])
        .range([0, width])

      const yScale = scaleBand()
        .domain(data.map(d => d.genre))
        .rangeRound([0, height])
        .paddingInner(0.25)

      // append group translated to chart area
      svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

      // draw header
      svg
        .append('g')
        .attr('class', 'bar-header')
        .attr('transform', `translate(0, ${-margin.top / 2})`)
        .append('text')
        .append('tspan')
        .text('Horizontal bar chart')

      // draw bars
      svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.genre))
        .attr('width', d => xScale(d.revenue))
        .attr('height', yScale.bandwidth())
        .style('fill', function (d, i) {
          return color[i % 4] // use colors in sequence
        })

      // draw axes
      const xAxis = axisBottom(xScale)
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height + margin.bottom / 3})`)
        .call(xAxis)

      const yAxis = axisLeft(yScale).tickSize(0)
      svg
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${-margin.left / 3},0)`)
        .call(yAxis)
    }
  }, [data])

  return (
    <svg
      className={styles.container}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      role="img"
      ref={d3svg}
    ></svg>
  )
}

export default Chart;