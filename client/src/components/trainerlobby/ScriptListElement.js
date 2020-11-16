import React, { Component } from "react";
import "./ScriptListElement.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'


export default class TrainerLobby extends Component {
    constructor(props) {
        super(props);
        ///this.onClick = this.props.callback.bind(this);
   
    }

    render() {
        const name = this.props.name;
        const edit = this.props.editScript;
        const deleteScript = this.props.deleteScript;
        const id = this.props.id;
        const passId = this.props.passId;
        return (
            <div className="list-group-item list-group-item-action">
                <div className="d-flex justify-content-start">
                    <div className="align-self-end">{name}</div>
                </div>
                <div className="d-flex justify-content-end">
                    {/*
                <FontAwesomeIcon icon={faEdit}/>
                <FontAwesomeIcon icon={faTrashAlt}/> */}
                    <button className="btn" value={id} onClick={edit}>Edit</button>
                    <button className="btn" data-toggle="modal" data-target="#exampleModal" value={id} onClick={e => passId(e.target.value)}>Delete</button>

                </div>



            </div>
        )


    }
}

