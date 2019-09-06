import React, {Component} from 'react';
import axios from 'axios';


class User extends Component {
    constructor(props) {
        super(props)
        this.state ={
            name: 'name',
            cooldown: 'cooldown',
            encumbrance: 'encumbrance',
            strength: 'strength',
            speed: 'speed',
            gold: 'gold',
            inventory: 'inventory',
            status: 'status',
            errors: 'errors',
            messages: 'messages',
        }
    }

    componentDidMount() {
        console.log('component did mount')
        // do something on startup to initialize data
    };

    render(){
        return (
            <div>
                {this.state.map((item) => (
                    <div key={item.name}>
                        {item.name}
                        {item.cooldown}
                        {item.encumbrance}
                        {item.strength}
                        {item.speed}
                        {item.gold}
                        {item.inventory}
                        {item.status}
                        {item.messages}
    
                    </div>
                ))}
    
            </div>
    
        )
    }

};



