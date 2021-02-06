import axios from "axios";
import { storeIndivDocApi } from "../socket-handlers/api";
import { SET_INDIV_TEXT, GET_ERRORS } from "./types";


export const storeIndivDoc = (text, docId) =>dispatch => {
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
                payload: err.response
            });
        });
}