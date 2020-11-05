import React, { Component } from "react";

export default class TrainerLobby extends Component {
    constructor(props) {
        super(props);
      
    }
    
    render() {
        const name= this.props.name;
        return (
            <a value={name} href="#" className="list-group-item list-group-item-action">
                {name}
            </a>)
    }
}