import React, { Component } from "react";

export default class TrainerLobby extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const clientId = this.props.name;
        return (
            <a href="#" className="list-group-item list-group-item-action">
                {this.name};
            </a>)
    }
}