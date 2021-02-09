import React, { Component } from "react";
import "./shared-doc.css";
import classnames from "classnames";
import { connect } from "react-redux";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import { connectSharedDoc, subscribeSharedDoc, submitOp } from "../../../actions/docActions";
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
    this.props.connectSharedDoc("dummy");

  }

  componentDidMount() {
    this.props.connectSharedDoc("dummy");
    this.props.subscribeSharedDoc(this.props.auth.user.id, (op, source) => { console.log(op)});

  }


  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    /*
    if (nextProps.localState.sharedDocEditing.isOpen) {
      this.props.subscribeSharedDoc((sharedDoc) => { console.log(sharedDoc) });
    }
    */
  }

  onCloseClick() {
    window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  }
  rteChange = (content, delta, source, editor) => {

    /*
    if (this.props.auth.user.id) {
        let doc = (this.props.auth.user.id + this.sessionId).toString();
        let docId = doc.hashCode();
        this.props.storeIndivDoc(editor.getHTML(), docId)

    }
    else (console.log("kein Benutzer"));
    */
   this.props.submitOp(delta, { source: this.props.auth.user.id });

}
  render() {
    console.log(this.props);
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
          formats={this.formats} value={this.props.docs.collabText} className="personal-notes"
          onChange={this.rteChange} /> : null
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  docs: state.docs, 
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setSharedDocEditing, connectSharedDoc, subscribeSharedDoc, submitOp }
)(SharedDoc);
