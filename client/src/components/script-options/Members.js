import React, { Component } from "react";
import { LOG } from "../logic-controls/logEvents";

// requires a parent with non static (e.g. relative position)
export default class Members extends Component {
    constructor(props) {
        super(props);
        this.urlInput = React.createRef();
        this.scriptTypeRef = React.createRef();

        this.state = {
            showUrl: false,
            _id: this.props._id
        }
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
        var url = window.location.href + this.state._id;
        window.logEvents.dispatch(LOG, {
            class: "success",
            message: `Send following URL to your friend: ${url}`
        });
    }
    render() {
        return (
            <span>
                {
                    this.state.showUrl ?
                        <a
                            href="#"
                            onClick={this.onShareSession.bind(this)}
                            className="nav-link"
                        >
                            Teilnehmer einladen<i className="fa fa-share-alt-square" />
                        </a> : null
                }
            </span>



        );

    }
}
