import React, { Component } from "react";
import { connect } from "react-redux";
import Arrow from 'react-arrow';
import "./arrows.css";


class Arrows extends Component {
    constructor(props) {
        super(props);
        this.state = { arrows: null };

    };
    componentDidUpdate() {
        this.showArrow();
    }

    showArrow() {
        var $icon = document.querySelector('.icon');
        var $arrow = document.querySelector('.newarrow');
        let arrows = null;
        if (this.props.assistent.actInstruction)
            if (this.props.assistent.actInstruction.markers) {
                arrows = this.props.assistent.actInstruction.markers.map(arrow => {

                    if (arrow.mode == "id") {
                        var element = document.getElementById(arrow.id).getBoundingClientRect();
                        var left = element.left + window.pageXOffset  + arrow.left;
                        var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));
                        var top = element.top + window.pageYOffset + halfheight + arrow.top;
                        $icon.style.visibility = "visible";
                        $icon.style.top = top + "px";
                        $icon.style.left = left + "px";
                        var newEl=document.createElement("div");
                        newEl.className="newarrow";
                        $icon.replaceChild(newEl, $arrow);

                    }
                }
                )
            }
            else
                $icon.style.visibility = "hidden";





    }


    render() {

        return (<div className="icon">
            <div className="newarrow"></div>
        </div>)
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