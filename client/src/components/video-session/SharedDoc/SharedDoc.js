import React, { Component } from "react";
import "./shared-doc.css";
import classnames from "classnames";
import { connect } from "react-redux";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import { getSharedDoc } from "../../../actions/docActions";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.bubble.css';

class SharedDoc extends Component {
  constructor(props) {
    super(props);
    this.doc = {};
    this.isOpen = false;
    this.sessionId = this.props.roomId;
    this.modules = {
      toolbar: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

  componentDidMount() {
    this.props.getSharedDoc("dummy");
    console.log(this.props.docs);
  }


  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
  }

  onCloseClick() {
    window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  }

  render() {
    return (
      <div
        id="SharedDoc"
        className={classnames("", {
          "hidden-nosize": !this.props.localState.sharedDocEditing.isOpen,
          docOffsetWithCollaborationBar: this.props.useOffset,
          docOffsetWithoutCollaborationBar: !this.props.useOffset
        })}
      >
        <ReactQuill modules={this.modules}
          formats={this.formats} value={this.props.docs.indivText} className="personal-notes"
          onChange={this.rteChange} /> : null
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  docs: state.docs
});

export default connect(
  mapStateToProps,
  { setSharedDocEditing, getSharedDoc }
)(SharedDoc);
