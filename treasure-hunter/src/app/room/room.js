import React, {Component} from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { init, getAllRooms, getRoom } from "db";
import { Card, CardContent, CardHeader } from "@material-ui/core";
// useEffect((currentRoom)=> {

// }, [currentRoom])

export class Room extends Component {
    constructor(props) {
        super(props)
        this.state ={
            isFetching: false,
            room: [],
            setPath: [],
            setCurrentRoom: [],
            currentRoom: []
        }
 



    }

     componentDidMount() {
        console.log('component did mount')
        this.somethingIsUpdated()
        
        console.log(this.state)

        init().then(room => {
            this.state.setPath([room])
            this.state.setCurrentRoom(room);
          });
        getAllRooms()
        console.log('get all rooms fired')
      
        // do something on startup to initialize data
    };


    


    somethingIsUpdated() {
        if(this.props.currentRoom == null){

            //  console.log(this.isFetching)
             
        }
          
        else {
            console.log(this.props.currentRoom.currentRoom.room_id)
        }


    }

    
    
    componentDidUpdate() {
        console.log('component did update')

      

    }

    render(){

        //
        if(!this.props.currentRoom) {
            return <div>Loading...</div>
        }
            // console.log(this.props.currentRoom, 'whatever')
        const {cooldown, coordinates, title, description, elevation, exits,terrain,errors, items, messages,} = this.props.currentRoom
        // console.log(cooldown, coordinates)

        return (
            <div>
                { 
                    
                  <div>
                      <Card>
                      <CardContent>{title}</CardContent>
                      {items.map(e => <CardContent>Items to pick up at this location {e}</CardContent>)}
                      <CardContent>Coordinates: {coordinates}  Elevation: {elevation} Cooldown: {cooldown} </CardContent>
                      <CardContent>Description: {description}</CardContent>
                      {messages.map((e, index) => <CardContent>message {index+1}: {e}</CardContent>)}
                   
                       
                       </Card>
                  </div>  
                
                }
                {/* <div class="value"> {this.state.isFetching == false ? 'Retrieving room information...' : this.props } </div>
     */}
            </div>
    
        )
    }

};


