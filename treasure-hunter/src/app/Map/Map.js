import React, { useState, useEffect } from 'react'
import { XYPlot, LineMarkSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries } from 'react-vis';

const Map = ({ rooms, path, currentRoom }) => {

    const [data, setData] = useState([])
    const [xDomain, setXDomain] = useState([])
    const [yDomain, setYDomain] = useState([])

    useEffect(() => {
        
        setData(path)
        
    }, [currentRoom])

    

    return (
        <>
            <XYPlot height={500} width={500}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <LineMarkSeries data={data} xPadding={10000 / data.length} yPadding={10000 / data.length}/>
                {data.length >= 1 ? <MarkSeries data={[data[data.length - 1]]} color={"red"} /> : null}
            </XYPlot>
        </>
    )

}
export default Map