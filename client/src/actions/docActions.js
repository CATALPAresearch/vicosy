import axios from "axios";
import { storeIndivDocApi, connectSharedDocAPI, subscribeSharedDocAPI, submitOpAPI } from "../socket-handlers/api";
import { SET_COLLAB_TEXT, SET_INDIV_TEXT, GET_ERRORS } from "./types";


export const submitOp = (delta, source) => dispatch =>{
submitOpAPI(delta, source);
}


export const subscribeSharedDoc = (userId, update) => dispatch => {

    subscribeSharedDocAPI(userId, 
        (err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err
            }),
        (collabText) => {
            dispatch({
                type: SET_COLLAB_TEXT,
                payload: collabText
            })
        },
        (op, source) => {update(op, source)})};



export const connectSharedDoc = (docId) => dispatch => {
    connectSharedDocAPI(docId);
    /*
    dispatch({
        type: SET_COLLAB_TEXT,
        payload: "doc"
    });
    */

}

export const storeIndivDoc = (text, docId) => dispatch => {
    storeIndivDocApi(text, docId);

    dispatch({
        type: SET_INDIV_TEXT,
        payload: text
    });


};

export const setIndivDoc = (text) => dispatch => {
    dispatch({
        type: SET_INDIV_TEXT,
        payload: text
    });

}

export const getIndivDoc = (docId) => dispatch => {
    axios
        .post("/api/docs/getindivdoc", { "docId": docId })
        .then(res => {

            console.log(res);
            dispatch({
                type: SET_INDIV_TEXT,
                payload: res.data.doc.text
            });
        }).catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err
            });
        });
}