import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import icon from './assistent.jpg'; 
class Assistent extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <img src={icon} alt="Lämpel" width="100" height="100"/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(withRouter(Assistent));
