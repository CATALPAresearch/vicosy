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
            fill="#FFCC30 "
            text="Chat"
            stroke="#FFCC30 "
            strokeWidth={2}
            style={this.style}
        />)
    }
}
