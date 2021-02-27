import React, { Component } from "react";
import { connect } from "react-redux";
import Arrow from 'react-arrow';
import "./arrows.css";


class Arrows extends Component {
    constructor(props) {
        super(props);
        this.state = { arrows: null };

    };


    showArrow() {
        const $icon = document.querySelector('.icon');
        const $arrow = document.querySelector('.arrow');
        let arrows = null;
        if (this.props.assistent.incomingInstruction)
            if (this.props.assistent.incomingInstruction.markers) {
                arrows = this.props.assistent.incomingInstruction.markers.map(arrow => {

                    if (arrow.mode == "id") {
                        var element = document.getElementById(arrow.id).getBoundingClientRect();
                        var left = element.left + window.pageXOffset - 80 + arrow.left;
                        var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));
                        var top = element.top + window.pageYOffset - 50 + halfheight + arrow.top;
                        $icon.setAttribute("top", halfheight);
                    }
                }
                )
            }


        $icon.onclick = () => {
            $arrow.animate([
                { left: '0' },
                { left: '10px' },
                { left: '0' }
            ], {
                duration: 700,
                iterations: Infinity
            });
        }


    }
    componentDidMount() {

        this.props.createRef(this);



    }

    render() {

        return (<div class="icon">
            <div class="arrow"></div>
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