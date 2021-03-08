import React, { Component } from "react";
import Arrow from 'react-arrow';

export default class HintArrow extends Component {
    constructor(props) {
        super(props);
this.style=this.props.style;
this.direction=this.props.direction;
    };

    render() {
        return (<Arrow className="arrow"
            key="chat"
            id="chat"
            direction={this.direction}
            shaftWidth={15}
            shaftLength={40}
            headWidth={40}
            headLength={30}
            fill="red"
            text="Chat"
            stroke="red"
            strokeWidth={2}
            style={this.style}
        />)
    }
}
