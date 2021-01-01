import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import assi_on from './lehrer.png';
import assi_off from './lehrer_aus.png';
import Instruction from "./Instruction";
class Assistent extends Component {
    constructor(props) {
        super(props);
        this.state = { display: "none" };

    }


    render() {
        return (
            <div id="assistent">
                <div id="overlay" style={{ display: this.state.display }}>
                    <div id="text">
                        test
                    </div>
                </div>

                <div className="panel" id="laempel">
                    <img src={assi_on} alt="Laempel" width="100%" height="100%" />
                </div>
                <Instruction 
                 instruction={this.props.assistent.act_instruction}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    assistent: state.assistent
});

export default connect(
    mapStateToProps
)(withRouter(Assistent));
