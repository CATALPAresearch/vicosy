import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import assi_on from './lehrer.png';
import assi_off from './lehrer_aus.png';
class Assistent extends Component {
    constructor(props) {
        super(props);
        this.state = { display: "none" };
     
    }

    componentDidMount() {
        this.setAccordeon();
      }

    on() {
        this.setState({ display: "block" });
    }

    off() {
        this.setState({ display: "none" });
    }
    setAccordeon (){
        var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");
    
        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
    


    }
    render() {
        return (
            <div id="assistent">
                <div id="overlay" style={{ display: this.state.display }}>
                    <div id="text">
                    </div>
                </div>
                <button id="switchAssistent" className="accordion">Assistent</button>
                <div className="panel" id="laempel">
                <img src={assi_on} alt="Laempel" width="100%" height="100%" />                
                </div>
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
