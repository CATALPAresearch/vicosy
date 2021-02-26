import React, { Component } from "react";
import { connect } from "react-redux";
import Arrow from 'react-arrow';
import "./assistent.css";


class Arrows extends Component {
    constructor(props) {
        super(props);
        this.state={ arrows: null };
    };

    componentDidMount() {
        this.props.createRef(this);
    }



    render() {
        if (this.props.assistent.actInstruction)
            if (this.props.assistent.actInstruction.markers) {
                this.setState({
                    arrows: this.props.assistent.actInstruction.markers.map(arrow => {

                        if (arrow.mode == "id") {


                            var element = document.getElementById(arrow.id).getBoundingClientRect();

                            var left = element.left + window.pageXOffset - 80 + arrow.left;

                            var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));

                            var top = element.top + window.pageYOffset - 50 + halfheight + arrow.top;
                            //position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });

                            return (
                                <Arrow className="arrow"
                                    key={arrow.id}
                                    id={arrow.id}
                                    direction={arrow.orientation}
                                    shaftWidth={15}
                                    shaftLength={40}
                                    headWidth={40}
                                    headLength={30}
                                    fill="red"
                                    text="Chat"
                                    stroke="red"
                                    strokeWidth={2}
                                    style={{ position: "absolute", left: left, top: top }}
                                />

                            );

                        }
                    }
                    )
                })

            }
        return (<div>{this.state.arrows}</div>)
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    assistent: state.assistent,
    rooms: state.rooms
});

export default connect(
    mapStateToProps
)(Arrows);