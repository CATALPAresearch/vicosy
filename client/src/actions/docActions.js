import axios from "axios";
import { storeIndivDocApi } from "../socket-handlers/api";
import { SET_INDIV_TEXT, GET_ERRORS } from "./types";


export const storeIndivDoc = (text, docId) => {
    storeIndivDocApi(text, docId);
    return {
        type: "irgendwas",
        payload: "irgendwas"
    };

};

export const setIndivDoc = (text) => dispatch => {
    dispatch({
        type: SET_INDIV_TEXT,
        payload: text
    });

}

export const getIndivDoc = (docId) => dispatch => {
    axios
        .post("/api/docs/getindivdoc", docId)
        .then(res => {
            alert("gut");
            dispatch({
                type: SET_INDIV_TEXT,
                payload: res
            });
        }).catch(err => {
            alert("fehler");
            dispatch({
                type: GET_ERRORS,
                payload: err
            });
        });
}