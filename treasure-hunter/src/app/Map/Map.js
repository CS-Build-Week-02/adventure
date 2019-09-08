import React, { useState, useEffect } from 'react'
import { XYPlot, LineMarkSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries } from 'react-vis';

const Map = ({ rooms, path, currentRoom }) => {

    const [data, setData] = useState([])

    useEffect(() => {
        let newRooms = path.map(room => {
            let str = room.coordinates.replace("(", "").replace(")", "").replace(",", "").split('')
            let coors = { x: parseInt(`${str[0]}${str[1]}`), y: parseInt(`${str[2]}${str[3]}`) }
            return coors
        })

        setData(newRooms)
    }, [currentRoom])

    

    return (
        <>
            <XYPlot height={500} width={500} animation={true}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <LineMarkSeries data={data} />
                {data.length > 1 ? <MarkSeries data={[data[data.length - 1]]} color={"red"} /> : null}
            </XYPlot>
        </>
    )

}
export default Map