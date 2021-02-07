import axios from "axios";
import { storeIndivDocApi, getSharedDocSocket } from "../socket-handlers/api";
import {SET_COLLAB_TEXT, SET_INDIV_TEXT, GET_ERRORS } from "./types";

export const getSharedDoc =(docId) => dispatch =>{
    let doc= getSharedDocSocket(docId);
    dispatch({
        type: SET_COLLAB_TEXT,
        payload: doc
    });

}

export const storeIndivDoc = (text, docId) =>dispatch => {
    storeIndivDocApi(text, docId);

    dispatch({
        type: SET_COLLAB_TEXT,
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