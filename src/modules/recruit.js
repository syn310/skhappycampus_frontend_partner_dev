import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/*
 * 액션 타입 정의
 */
const SET_RECRUIT_NOTICE_LIST = 'recruit/SET_RECRUIT_NOTICE_LIST';
const SET_RECRUIT_NOTICE_INFO = 'recruit/SET_RECRUIT_NOTICE_INFO';
const TOGGLE_VISIBLE = 'recruit/TOGGLE_VISIBLE';
const SET_RECRUIT_COMPANY_DATA = 'recruit/SET_RECRUIT_COMPANY_INFO';

/*
 * 액션 생성 함수 정의
 */
export const setRecruitNoticeList = createAction(SET_RECRUIT_NOTICE_LIST);
export const setRecruitNoticeInfo = createAction(SET_RECRUIT_NOTICE_INFO);
export const toggleVisible = createAction(TOGGLE_VISIBLE);
export const setRecruitCompanyData = createAction(SET_RECRUIT_COMPANY_DATA);

/*
 * 초기상태 정의
 */
const initialState = Map({
    recruitNoticeList: [],
    recruitInfo: {
        serialNumber: "",
        noticeName: '',
        noticeImagePath: '',
        noticeStatus: '',
        noticeStartDatetime: '',
        noticeEndDatetime: '',
        internStartDate: '',
        internEndDate: '',
        description:""
    },
    recruitCompanyData: {
        serialNumber: "",
        companyId: "",
        preferDegree: "",
        preferencePoint: "",
        recruitJob: "",
        recruitNumber: "",
        recruitType: "",
        remark: "",
        workplace: "",
        fulltimeSalary: "",
        jobDetail: "",
    }
});


/*
 * reducer 작성
 */
export default handleActions({

    [SET_RECRUIT_NOTICE_LIST] : (state, action) => {
      return state.set('recruitNoticeList',action.payload);
    },
    [SET_RECRUIT_NOTICE_INFO] : (state, action) => {
      return state.setIn(['recruitInfo','serialNumber'], action.payload.serialNumber)
                  .setIn(['recruitInfo','noticeName'], action.payload.noticeName)
                  .setIn(['recruitInfo','noticeImagePath'], action.payload.noticeImagePath)
                  .setIn(['recruitInfo','noticeStatus'], action.payload.noticeStatus)
                  .setIn(['recruitInfo','noticeStartDatetime'], action.payload.noticeStartDatetime)
                  .setIn(['recruitInfo','noticeEndDatetime'], action.payload.noticeEndDatetime)
                  .setIn(['recruitInfo','internStartDate'], action.payload.internStartDate)
                  .setIn(['recruitInfo','internEndDate'], action.payload.internEndDate)
                  .setIn(['recruitInfo','description'], action.payload.description);
    },
    [SET_RECRUIT_COMPANY_DATA] : (state, action) => {
      return state.setIn(['recruitCompanyData','serialNumber'], action.payload.serialNumber)
                  .setIn(['recruitCompanyData','companyId'], action.payload.companyId)
                  .setIn(['recruitCompanyData','preferDegree'], action.payload.preferDegree)
                  .setIn(['recruitCompanyData','preferencePoint'], action.payload.preferencePoint)
                  .setIn(['recruitCompanyData','recruitJob'], action.payload.recruitJob)
                  .setIn(['recruitCompanyData','recruitNumber'], action.payload.recruitNumber)
                  .setIn(['recruitCompanyData','recruitType'], action.payload.recruitType)
                  .setIn(['recruitCompanyData','remark'], action.payload.remark)
                  .setIn(['recruitCompanyData','workplace'], action.payload.workplace)
                  .setIn(['recruitCompanyData','fulltimeSalary'], action.payload.fulltimeSalary)
                  .setIn(['recruitCompanyData','jobDetail'], action.payload.jobDetail);
                  
    }
    
}, initialState);
