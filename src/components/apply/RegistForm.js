
import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 
import "react-datepicker/dist/react-datepicker.css";
import { bindActionCreators } from 'redux';
import * as applyActions from 'modules/apply';
import * as authActions from 'modules/auth';
import * as menuActions from 'modules/menu';
import axios from 'axios';
import storage from 'lib/storage';
import {dateFormat, dateBarFormat} from 'lib/dateFormat';
import devtest from 'lib/devtest';


import { RegistBasicInfo, 
        RegistDegreeInfo,
        RegistExtraCert } from 'components';

//step 4 단계
class RegistForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            stepIndex: "3",
            serialNumber:"",
            //////////////////////////////
            savedYn: false,
            addressSearchPopup: false,
            code:{
                nationalityCode:[],
                degreeCode: [],
                graduStatusCode: []

            },
            basicInfo: { //지원자 기본정보
                serialNumber:"",
                applyUserId:"",
                applyName:"",
                applyNationality:"대한민국",
                applyBirth:"",
                applyGender:"",
                applyPhone:"",
                applyAddress:"",
                //applyAddressDetail:"",
                applyStatus:"3",
                disabilityYn:"",
                militaryYn:"",
                veteransYn:""
            },
            degreeInfoArr : [ //지원자 학력정보 고등학교는 필수
                    {
                        serialNumber:"",
                        applyUserId:"",
                        educationSeq:"1",
                        degree:"",
                        graduStatus:"",
                        enterDateInfo:"",
                        graduDateInfo:"",
                        schoolName:"",
                        major:"",
                        minor:"",
                        doubleMajor:"",
                        grade:"",
                        perfectGrade:"",
                        transferYn1:"아니오",
                        mainCampusYn1:"본교"
                    }
                    
            ], 

            extraCertArr: [] //지원자 추가 자격정보 (선택사항)
        }
    }



    componentDidMount = (e) => {
        window.scrollTo(0, 0);
        this.getApplyContent()

    }

    getApplyContent = () => {
        this.getBasicInfo(); //기본정보
        //this.getDegreeInfoArr(); //학력정보
        //this.getExtraCertArr(); //추가자격증정보
    }


    //기본정보 가져오기
    getBasicInfo = () => {
        
        const self = this;
        const { serialNumber, applyUserId, ApplyActions } = this.props;
        axios({
            url: devtest() +  `/apply/${serialNumber}/${applyUserId}`,
            method : 'get',
            headers: {  "Pragma": 'no-cache',
                        "x-access-token": storage.getToken() 
                    }
        }).then(
            (res)=>{
                if(res.data){
                    let phoneNumber = res.data.applyPhone; 
                    res.data["applyPhone"] = phoneNumber.length == 0 ? "" : phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 7) + "-" + phoneNumber.substring(7, 11);
                    
                    ApplyActions.setApplyInfo(res.data);
                    //console.log(res)
                    this.setState({
                        basicInfo: this.props.basicInfo
                    })
                    self.getDegreeInfoArr(res.headers);

                }
                
            }
        )
        .catch((err)=>{
            //공통에러처리
        })

    }

    //학력정보 가져오기
    getDegreeInfoArr = (header) => {

        const { basicInfo } = this.state; 
        const self = this;
        const { serialNumber, applyUserId, ApplyActions } = this.props;

        axios({
            url: devtest() +  `/applyEducation/${serialNumber}/${applyUserId}`, 
            method : 'get',
            headers: {  "Pragma": 'no-cache',
                        "x-access-token":  header.newtoken 
                     }
        }).then(
            (res)=>{
                if(res.data){
                    if(res.data.length == 0){

                        const degreeInfoArr = [ //지원자 학력정보 고등학교는 필수 -> 무조건 넣는다
                                            {
                                                serialNumber: basicInfo.serialNumber,
                                                applyUserId: basicInfo.applyUserId,
                                                educationSeq:"1",
                                                degree:"고등학교",
                                                graduStatus:"졸업",
                                                enterDateInfo:"",
                                                graduDateInfo:"",
                                                schoolName:"",
                                                major:"",
                                                minor:"",
                                                doubleMajor:"",
                                                grade:"",
                                                perfectGrade:"",
                                                transferYn1:"아니오",
                                                mainCampusYn1:"본교",
                                            }
                                ];

                        ApplyActions.setDegreeInfo(degreeInfoArr);
                        this.setState({
                            degreeInfoArr
                        })
                    }else{

                        //본교/캠퍼스 , 편입여부 radio name과 state의 mainCampusYn, transferYn을 동일형태로 넣어주기 위함.
                        let degreeAfter = []; //_.cloneDeep(res.data);
                        res.data.forEach((obj,idx) => {
                            const transferVal = obj.transferYn;
                            const mainCampusVal = obj.mainCampusYn;
                            obj[`transferYn${obj.educationSeq}`] = transferVal;
                            obj[`mainCampusYn${obj.educationSeq}`] = mainCampusVal;
                            degreeAfter.push(obj)
                        })

                        //위 작업을 지나면 degreeInfo에는 transferYn 과 transterYn${educationSeq} 형태의 두가지가
                        //존재하게됨. 하지만 실제로 사용하는 애는 후자이므로. 아래 validation에서 transferYn는 빼고체크함
                        
                        ApplyActions.setDegreeInfo(degreeAfter);
                        this.setState({
                            degreeInfoArr: degreeAfter
                        })
                    }
                    self.getExtraCertArr(res.headers); //추가자격증정보

                }

            }
        ).catch((err)=>{
            //공통에러처리
        })


    }

    //자격증정보 가져오기
    getExtraCertArr = (header) => {

        const { basicInfo } = this.state; 
        const self = this;
        const { serialNumber, applyUserId, ApplyActions } = this.props;

        axios({
            url:devtest() +  `/applyCertificate/${serialNumber}/${applyUserId}`, 
            method : 'get',
            headers: {  "Pragma": 'no-cache',
                        "x-access-token": header.newtoken 
                    }
        }).then(
            (res)=>{
                if(res.data){
                    storage.setSessionObj(res.headers);
                    ApplyActions.setCertInfo(res.data);
                    this.setState({
                        extraCertArr: this.props.extraCertArr
                    })

                }

            }
        )
        .catch((err)=>{
            //공통에러처리
        })

    }


    clickBack = () => {
        this.props.history.push("/applylist");
    }
 

    render() { 

        const { basicInfo,
                degreeInfoArr,
                extraCertArr } = this.state;

        const { clickBack } = this;

        return ( 
            <div className="sub-contents">
                <div className="sub-container">
                    <div className="location">
                        <div className="location-inner">
                            <div className="location-item">홈</div>
                            <div className="location-item">></div>
                            <div className="location-item">지원현황</div>
                        </div>
                    </div>
                    <div className="sub-info">
                        <h2 className="sub_heading">지원자 정보</h2>
                        <div className="sub_heading_text">지원을 완료한 지원자의 상세정보를 확인하세요</div>
                        <br />
                    </div>
                <div className="clear"></div>
            
                <div className="sub_box">
                    <div className="apply_step4">
                        <div className="apply_step4_list">
                            {/* /////////////////////////////////////////////////////////////////// */}
                            <div>
                                <div className="apply_step4_table_title" id="basicInfoTitle">개인정보</div>
                                <RegistBasicInfo basicInfo={basicInfo} />
                            </div>
                            {/* /////////////////////////////////////////////////////////////////// */} 
                            <div className="apply_step4_table_area">                              
                                <div className="apply_step4_table_title">학력사항</div>
                                <RegistDegreeInfo degreeInfoArr={degreeInfoArr} />
                            </div>
                            {/* /////////////////////////////////////////////////////////////////// */}
                            <div className="apply_step4_table_area">
                                <div className="apply_step4_table_title">자격증(선택사항)</div>
                                <RegistExtraCert extraCertArr={extraCertArr} />
                            </div> 
                            {/* /////////////////////////////////////////////////////////////////// */}
                            <div className="apply_step4_table_area">
                                <div className="apply_step4_table_title">자기소개서</div>
                                <div className="textarea_apply_disabled" disabled name="coverLetter">{basicInfo.coverLetter}</div>
                            </div>
                        </div>  
                    </div>
                </div>

                <div className="page_btn_area_agreement">
                    <div className="page_btn_box">
                    <a className="btn_full_next gt-f-c" onClick={clickBack}>뒤로가기</a>
                    <div className="clear"></div>
                    </div>
                </div>
           
            </div>

        </div>


         );
    }
}

// 컴포넌트에 리덕스 스토어를 연동해줄 때에는 connect 함수 사용
export default connect(
    //props로 넣어줄 스토어 상태값
    
    (state) => ({
        serialNumber:  state.apply.get('serialNumber'),
        applyUserId:  state.apply.get('applyUserId'),
        applyName:  state.apply.get('applyName'),
        basicInfo: state.apply.get('basicInfo'),
        degreeInfoArr: state.apply.get('degreeInfoArr'),
        extraCertArr: state.apply.get('extraCertArr'),
        isLogin: state.auth.get('isLogin'),
        userId: state.auth.get('userId'),
        userType: state.auth.get('userType'),
        applyStatus: state.apply.get('applyStatus'),
        
    })
    //props로 넣어줄 액션 생성함수
    , (dispatch) => ({
        ApplyActions : bindActionCreators(applyActions, dispatch),
        AuthActions: bindActionCreators(authActions, dispatch),
        MenuActions : bindActionCreators(menuActions, dispatch)
    })
)(RegistForm);

