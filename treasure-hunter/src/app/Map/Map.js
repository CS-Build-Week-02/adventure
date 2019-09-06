import React, {useState, useEffect} from 'react'

const Map = ({rooms}) => {
    

      return (
          <>
          <ul>
          {rooms.map(room => <li key={room.room_id}>{room.coordinates}</li>)}
          </ul>
          </>
      )
}

export default Map