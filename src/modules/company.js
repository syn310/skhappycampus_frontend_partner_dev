import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/*
 * 액션 타입 정의
 */
const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST';
const SET_COMPANY_INFO = 'company/SET_COMPANY_INFO';
const SET_COMPANY_BASIC_INFO = 'company/SET_COMPANY_BASIC_INFO';
const SET_COMPANY_ID = 'company/SET_COMPANY_ID';
/*
 * 액션 생성 함수 정의
 */

export const setCompanyList = createAction(SET_COMPANY_LIST);
export const setCompanyInfo = createAction(SET_COMPANY_INFO);
export const setCompanyBasicInfo = createAction(SET_COMPANY_BASIC_INFO);
export const setCompanyId = createAction(SET_COMPANY_ID);

/*
 * 초기상태 정의
 */
const initialState = Map({
    companyList:[],
    companyInfo: {},
    companyBasicInfo: {
        companyId: "",
        companyName:"",
        companyType:"",
        companyAddress:"",
        companyGuide:"",
        companyUrl:"",
        contactPerson:"",
        contactPhone:"",
        idealType:"",
        sales:"",
        employeeNumber: "",
        companyLogoUrl: ""
    },
    companyId:"",


});

/*
 * reducer 작성
 */
export default handleActions({

    [SET_COMPANY_LIST] : (state, action) => {
        return state.set('companyList', action.payload)
    },
    [SET_COMPANY_INFO] : (state, action) => {
        return state.set('companyInfo', action.payload)
    },
    [SET_COMPANY_BASIC_INFO] : (state, action) => {
        return state.set('companyBasicInfo', action.payload)
    },
    [SET_COMPANY_ID] : (state, action) => {
        return state.set("companyId", action.payload)
    },
}, initialState);
