import React, { Component } from "react";
import { LOG } from "../logic-controls/logEvents";

// requires a parent with non static (e.g. relative position)
export default class Members extends Component {
    constructor(props) {
        super(props);
        this._id = props._id;
        this.state =
            { url: "" }

    }
    showLink = () => {
        this.setState({
            showUrl: true
        })
    }

    hideLink = () => {
        this.setState({
            showUrl: false
        })
    }

    onShareSession() {
        this.props.showUrl();
    }
    render() {
        return (
            <div>
                <a
                    href="#"
                    onClick={this.onShareSession.bind(this)}
                    className="nav-link"
                >
                    Teilnehmer einladen<i className="fa fa-share-alt-square" />
                </a>
                <p>{this.state.url}</p>

            </div>
        );

    }
}
