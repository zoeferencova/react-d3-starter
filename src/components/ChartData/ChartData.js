import { useState, useEffect } from 'react'
import { csv, ascending } from 'd3'
import Chart from '../Chart/Chart'

const parseNA = string => (string === 'NA' ? undefined : string)

const row = d => {
    return {
        genre: parseNA(d.genre),
        revenue: +d.revenue,
    }
}

const filterData = data => {
    return data.filter(d => {
        return d.revenue > 0
    })
}

const prepareChartData = data => {
    // usually more wrangling is required but the example data is simple
    return data
}

const ChartData = () => {
    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        csv('/static/data/barchart.csv', row).then(data => {
            const dataClean = filterData(data)
            setChartData(
                prepareChartData(dataClean).sort((a, b) => {
                    return ascending(a.genre, b.genre)
                }),
            )
        })
    }, [])

    if (chartData === null) {
        return <p>Loading...</p>
    }

    return <Chart data={chartData} />
}

export default ChartData;
