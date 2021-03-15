import React, { Component} from 'react'
import { connect } from "react-redux";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import "./personal-notes.css";
import { storeIndivDoc, getIndivDoc } from '../../../../actions/docActions';




class PersonalNotes extends Component {
    constructor(props) {
        super(props);
        // this.state = { text: '' } // You can also pass a Quill Delta here
        this.rteChange = this.rteChange.bind(this);
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

    
    rteChange = (content, delta, source, editor) => {
        //this.setState({ text: content })
/*        console.log(editor.getHTML()); // HTML/rich text
        console.log(editor.getText()); // plain text
        console.log(editor.getLength()); // number of characters
        console.log(delta); // number of characters
*/
        if (this.props.auth.user.id) {
            let doc = (this.props.auth.user.id + this.sessionId).toString();
            let docId = doc.hashCode();
            this.props.storeIndivDoc(editor.getHTML(), docId)

        }
        else (console.log("kein Benutzer"));

    }



    componentWillReceiveProps(nextProps) {
        this.isOpen = nextProps.localState.sideBarTab.activeTab === "notes-tab";
     

    }

    componentDidMount() {
        if (this.props.auth.user.id) {
            let doc = (this.props.auth.user.id + this.sessionId).toString();
            this.props.getIndivDoc(doc.hashCode());

        }

    }

    render() {
        return (
            this.isOpen ? <ReactQuill modules={this.modules}
                formats={this.formats} value={this.props.docs.indivText} className="personal-notes"
                onChange={this.rteChange} /> : null
        )

    }

}


const mapStateToProps = state => ({
    auth: state.auth,
    localState: state.localState,
    rooms: state.rooms,
    docs: state.docs
});

PersonalNotes.defaultProps = {
    visible: true
};

export default connect(
    mapStateToProps,
    { storeIndivDoc, getIndivDoc }
)(PersonalNotes);
