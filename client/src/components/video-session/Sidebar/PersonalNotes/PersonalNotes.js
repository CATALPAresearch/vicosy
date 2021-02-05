import React, { Component, useEffect, useMemo, useState } from 'react'
import { connect } from "react-redux";
import classnames from "classnames";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import "./personal-notes.css";




class PersonalNotes extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        this.isOpen=false;
        this.modules = {
            toolbar: [
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{ 'align': [] }],
              [{ 'color': [] }, { 'background': [] }],
              ['clean']
            ]
        };
        this.formats = [
            'font',
            'size',
            'bold', 'italic', 'underline',
            'list', 'bullet',
            'align',
            'color', 'background'
          ];
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    componentWillReceiveProps(nextProps) {
        this.isOpen = nextProps.localState.sideBarTab.activeTab === "notes-tab";
   
      }

    render() {
        return (
            this.isOpen?<ReactQuill modules={this.modules}
            formats={this.formats} value={this.state.text} className="personal-notes"
                onChange={this.handleChange} />:null
        )

    }

}


const mapStateToProps = state => ({
    auth: state.auth,
    localState: state.localState,
    rooms: state.rooms
  });
  
  PersonalNotes.defaultProps = {
    visible: true
  };
  
  export default connect(
    mapStateToProps,
    null
  )(PersonalNotes);
  