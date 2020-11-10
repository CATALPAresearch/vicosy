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
                    <button className="btn" value={id} onClick={deleteScript}>Delete</button>

                </div>


                <div className="modal fade" id="DeleteDialog" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Echt jetzt?</h4>
                            </div>
                            <div className="modal-body">Willst du das Angebot wirklich löschen?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary btn-ok">OK</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Abbrechen</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )


    }
}

