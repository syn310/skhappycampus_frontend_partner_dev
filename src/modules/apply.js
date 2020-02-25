import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import _ from 'lodash';

const SET_COVER_LETTER = 'apply/SET_COVER_LETTER';
export const setCoverLetter = createAction(SET_COVER_LETTER);

const SET_APPLY_INFO = 'apply/SET_APPLY_INFO';
export const setApplyInfo = createAction(SET_APPLY_INFO);

const SET_DEGREE_INFO = 'apply/SET_DEEGREE_INFO';
export const setDegreeInfo = createAction(SET_DEGREE_INFO);

const SET_CERT_INFO = 'apply/SET_CERT_INFO';
export const setCertInfo = createAction(SET_CERT_INFO);

const SET_COMPANY_LIST = 'apply/SET_COMPANY_LIST';
export const setCompanyList = createAction(SET_COMPANY_LIST);

const SET_SERIAL_NUMBER = 'apply/SET_SERIAL_NUMBER';
export const setSerialNumber = createAction(SET_SERIAL_NUMBER);

const SET_APPLY_STATUS = 'apply/SET_APPLY_STATUS';
export const setApplyStatus = createAction(SET_APPLY_STATUS);

/** BP사용 추가  추후에 위에 내용 정리 필요*/
const SET_APPLY_DETAIL = 'apply/SET_APPLY_DETAIL';
export const setApplyDetail = createAction(SET_APPLY_DETAIL);

const SET_APPLY_LIST = 'apply/SET_APPLY_LIST';
export const setApplyList = createAction(SET_APPLY_LIST);



const initialState = Map({
    
    basicInfo: {},
    degreeInfoArr: [],
    extraCertArr: [],
    coverLetter: "",

    companyList:[],
    recommendList:[],

    regionCode:"",
    noticeNumber:"",
    serialNumber: "",
    applyStatus:"",

    /** BP사용 추가  추후에 위에 내용 정리 필요*/
    applyUserId:"",
    serialNumber:"",
    applyName:"",
    applyList:[],

});


//작성중
export default handleActions({

    [SET_APPLY_INFO] : (state, action) => {
        return state.set("basicInfo", action.payload);
    },

    [SET_DEGREE_INFO] : (state, action) => {
        //console.log("deegree", action.payload)
        return state.set("degreeInfoArr", action.payload);
    },

    [SET_CERT_INFO] : (state, action) => {
        return state.set("extraCertArr", action.payload);
    },

    [SET_COVER_LETTER] : (state, action) => {
        return state.set("coverLetter", action.payload);
    },


    [SET_SERIAL_NUMBER] : (state, action) => {
        return state.set("serialNumber", action.payload);           
    },

    [SET_COMPANY_LIST] : (state, action) => {
        //console.log(action.payload)
        return state.set("companyList", action.payload)
    },

    [SET_APPLY_STATUS] : (state, action) => {
        return state.set("applyStatus", action.payload)
    },

    /** BP사용 추가  추후에 위에 내용 정리 필요*/
    [SET_APPLY_DETAIL] : (state, action) => {
        return state.set("applyUserId", action.payload.applyUserId)
                    .set("serialNumber", action.payload.serialNumber)
                    .set("applyName", action.payload.applyName)
                    
    },
    [SET_APPLY_LIST] : (state, action) => {
        return state.set("applyList", action.payload)
    },



}, initialState);
