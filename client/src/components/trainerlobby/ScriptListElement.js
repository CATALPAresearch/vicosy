import React, { Component } from "react";
import "./ScriptListElement.css";


export default class TrainerLobby extends Component {

    render() {
        const name = this.props.name;
        const edit = this.props.editScript;
        const id = this.props.id;
        const passId = this.props.passId;
        const started =this.props.started;
        return (
            <div className="list-group-item list-group-item-action">
                <div className="d-flex justify-content-start">
                    <div className="align-self-end">{name}</div>
                </div>
                <div className="d-flex justify-content-end">
                    {/*
                <FontAwesomeIcon icon={faEdit}/>
                <FontAwesomeIcon icon={faTrashAlt}/> */}
                    <button id="bearbeiten" className="btn" value={id} onClick={edit}>{started?"ansehen":"bearbeiten"}</button>
                    <button id="loeschen" className="btn" data-toggle="modal" data-target="#exampleModal" value={id} onClick={e => passId(e.target.value)}>Löschen</button>

                </div>



            </div>
        )


    }
}

