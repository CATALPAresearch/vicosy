import React, { Component } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import "./shared-doc.css";
import classnames from "classnames";
import { connect } from "react-redux";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";
import { subscribeSharedDoc } from "../../../actions/docActions";
import {updateInstruction} from "../../../actions/assistentActions";


// Registering the rich text type to make sharedb work
// with our quill editor
Sharedb.types.register(richText.type);




class SharedDoc extends Component {
  constructor(props) {
    super(props);
    Sharedb.types.register(richText.type);
    // Connecting to our socket server
    const socket = new WebSocket('ws://127.0.0.1:8080');
    const connection = new Sharedb.Connection(socket);

    // Querying for our document

    this.doc = {};
    this.isOpen = false;
    this.sessionId = this.props.roomId;
    const doc = connection.get('docs', this.sessionId);

    doc.subscribe(function (err) {
      if (err) throw err;

      const options = {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
          ]
        },
        formats: [
          'font',
          'size',
          'bold', 'italic', 'underline',
          'list', 'bullet',
          'align',
          'color', 'background'
        ]
      };
      let quill = new Quill('#editor', options);
      /**
       * On Initialising if data is present in server
       * Updaing its content to editor
       */
      quill.setContents(doc.data);

      /**
       * On Text change publishing to our server
       * so that it can be broadcasted to all other clients
       */
      quill.on('text-change', function (delta, oldDelta, source) {
        if (source !== 'user') return;
        doc.submitOp(delta, { source: quill });
        quill.focus()
      });

      /** listening to changes in the document
       * that is coming from our server
       */
      doc.on('op', function (op, source) {
        if (source === quill) return;
        quill.updateContents(op);
        quill.focus()
      });
    });



  }

  componentDidMount() {
    /*
    this.props.connectSharedDoc("dummy");
    this.props.subscribeSharedDoc(this.props.auth.user.id, (op, source) => {

      this.props.upDateSharedDoc(this.props.docs.collabText, op, source);

    });
*/
    this.props.subscribeSharedDoc(this.sessionId);
  }


  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
    //  console.log(nextProps);


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
    this.props.submitOp(delta, this.props.auth.user.id);

  }
  render() {
    // Connecting to our socket server


    return (
      <div
        id="SharedDoc"
        className={classnames("", {
          "hidden-nosize": !this.props.localState.sharedDocEditing.isOpen,
          docOffsetWithCollaborationBar: this.props.useOffset,
          docOffsetWithoutCollaborationBar: !this.props.useOffset
        })}
      >
        <div id='editor'></div>
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
  {updateInstruction, subscribeSharedDoc/* setSharedDocEditing, connectSharedDoc, subscribeSharedDoc, submitOp, upDateSharedDoc, setSharedDoc */ }
)(SharedDoc);
