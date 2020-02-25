import React, { Component } from 'react';
import axios from  'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as recruitActions from 'modules/recruit';
import * as authActions from 'modules/auth';
import * as companyActions from 'modules/company';

import { RecruitList, RecruitPopup, RecruitCompanyPopup } from 'components';
import storage from 'lib/storage';
import devtest from 'lib/devtest';
import {isNumberReg} from 'lib/regex';

class RecruitCompanyContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber:"",
            applyUserId:"",
            openPopup: false,
            openCompanyInfoPopup: false, 
            recruits: [],
            code:{
                salaryCode:[],
                degreeCode: [],
            },
            recruitCompanyInfo: {
                preferDegree: "",
                preferencePoint: "",
                recruitJob: "",
                recruitNumber: "",
                recruitType: "",
                remark: "",
                workplace: "",
                fulltimeSalary: "",
                jobDetail: "",
                
            },
            popupType: ""
        }
    }
    /** 컴포넌트가 DOM위에 만들어지기 전에 실행 */
    componentDidMount() {
        this.setState({
            applyUserId: storage.getUserInfo(),
        })
       
        //모집공고 리스트 조회
        this.handleGetRecruitNoticeList();
    }

    /** 코드 데이터 조회 */
    getCodeValue = () => {

        const { code } = this.state;

        axios({
            url: devtest() +  `/commonCode/SALARY/S`,
            method : 'get',
            headers: { Pragma: 'no-cache'}
        }).then(
            (res)=>{
                if(res.data){
                    //console.log("", res.data)
                    code["salaryCode"] = res.data;
                    this.setState({
                        code
                    })
                }
            }
        ).catch(
            (err)=>{ if(err) console.log("코드 get err", err.response); }
        )

        axios({
            url: devtest() +  `/commonCode/DEGREE/S`,
            method : 'get',
            headers: { Pragma: 'no-cache'}
        }).then(
            (res)=>{
                if(res.data){
                    code["degreeCode"] = res.data;
                    this.setState({
                        code
                    })
                }
            }
        ).catch(
            (err)=>{ if(err) console.log("코드 get err", err.response); }
        )
    }

    /** 모집공고 리스트 조회 */
    handleGetRecruitNoticeList = () => {
        const self = this;
        const companyId  = storage.getCompanyId();
        axios({
            url:devtest() +`/recruitNotice/recruitNoticeByCompany/${companyId}`,
            method:"get",
            headers: {  "Pragma": 'no-cache', 
                "x-access-token": storage.getToken() }
          })
        .then(function(res) {
            if (res.data){
                //조회한 데이터 store에 셋팅
                self.setState({
                  recruits: res.data
                });
                //토큰 Refresh
                storage.setSessionObj(res.headers);
            }
        }).catch(function(error) {
          console.log(error);
        });
    }
    
    /** 모집공고 상세보기 팝업 */
    handlePopupOpen = (recruitCompanyInfo) => {
        const { RecruitActions } = this.props;
        
        RecruitActions.setRecruitNoticeInfo(recruitCompanyInfo);
        //팝업 visible true 셋팅
        this.setState({
            openPopup: true,
        });
    }

    /** 모집공고 상세보기 팝업 닫기 */
    handlePopupClose = () => {
        this.setState({openPopup:false})
    }

    /** 채용정보 등록 팝업 닫기 */
    handleCompanyPopupClose = () => {
        this.setState({openCompanyInfoPopup:false})
    }

    /**  등록 버튼 클릭 */
    handleAddRecruitInfo = (recruitCompanyInfo, popupType) => {
        const self = this;
        const {RecruitActions} = this.props;
        const  companyId  = storage.getCompanyId();

        if(!companyId){
            alert("잘못된 로그인 정보입니다.");
            return;
        }
        //코드 데이터 조회
        this.getCodeValue();

        //공고번호 셋팅
        this.setState({
            serialNumber: recruitCompanyInfo.serialNumber
        });

        axios({
            url:devtest() +`/companyRecruit/${recruitCompanyInfo.serialNumber}/${companyId}`,
            method:"get",
            headers: {  "Pragma": 'no-cache', 
                        "x-access-token": storage.getToken() }
          })
        .then(function(res) {
          if (res.data){
            //조회한 데이터 store에 셋팅
            RecruitActions.setRecruitCompanyData(res.data);
            //사용자에게 보여줄 recruitCompanyInfo 데이터 셋팅
            self.setState({
                recruitCompanyInfo: Object.assign({}, res.data),
            });
            //토큰 Refresh
            storage.setSessionObj(res.headers);
            //팝업 OPEN
            self.setState({openCompanyInfoPopup:true, popupType: popupType});
          }
        }).catch(function(err) {
        });
        
    }

    /** select box 변경시 */
    handleSelectChange = (e) => {
        let { recruitCompanyInfo } = this.state;
        let fulltimeSalaryStart = document.getElementsByName('fulltimeSalaryStart')[0].value;
        let fulltimeSalaryEnd = document.getElementsByName('fulltimeSalaryEnd')[0].value;
        const numFulltimeSalaryStart = fulltimeSalaryStart.replace(/,/g,'').replace(/만/g,'');
        const numFulltimeSalaryEnd = fulltimeSalaryEnd.replace(/,/g,'').replace(/만/g,'');
        /** 별도 협의를 선택한 경우 */
        if(e.target.name === "fulltimeSalaryStart" && e.target.value === "별도협의"){
            // 별도협의 선택시 fulltimeSalaryEnd의 selectbox 셋팅
            document.getElementsByName('fulltimeSalaryEnd')[0].value = "" ;
            recruitCompanyInfo['fulltimeSalary'] = e.target.value;
        }
        /** 후자 연봉만 입력한 경우 */
        else if(fulltimeSalaryStart === "" && numFulltimeSalaryEnd !==""){
            alert("연봉 범위를 확인해주시기 바랍니다.");
            document.getElementsByName('fulltimeSalaryEnd')[0].value = "" ;
            recruitCompanyInfo['fulltimeSalary'] = fulltimeSalaryStart;
        }
        /** 전자 연봉이 후자 연봉보다 큰 경우 */
        else if(fulltimeSalaryStart !=="" && fulltimeSalaryEnd !=="" && numFulltimeSalaryStart >= numFulltimeSalaryEnd ){
            alert("연봉 범위를 확인해주시기 바랍니다.");
            document.getElementsByName('fulltimeSalaryEnd')[0].value = "" ;
            recruitCompanyInfo['fulltimeSalary'] = fulltimeSalaryStart;
        }
        /** 전자 연봉만 입력한 경우 */
        else{
            recruitCompanyInfo['fulltimeSalary'] 
            = fulltimeSalaryStart !== "" && fulltimeSalaryEnd === "" ?
            fulltimeSalaryStart
            : fulltimeSalaryStart + "~" +fulltimeSalaryEnd
        }
        this.setState({ recruitCompanyInfo});
    }

    handleInputChange = (e) => {
        let { recruitCompanyInfo } = this.state;
        recruitCompanyInfo[e.target.name] =  e.target.type === 'number' ? parseInt(e.target.value) : e.target.value; 
        this.setState({ recruitCompanyInfo});
    }
    /** 
     * 데이터 validation
     * 필수값 입력 확인
     * 사원수, 매출액 숫자만 입력
     * 홈페이지 주소 url 검증
     */
    validation = () => {
        let result = true;
        const {recruitCompanyInfo} = this.state;

        if((recruitCompanyInfo.preferDegree || "") === ""
        || (recruitCompanyInfo.fulltimeSalary || "") === ""
        || (recruitCompanyInfo.recruitJob || "") === ""
        || (recruitCompanyInfo.jobDetail || "") === ""
        || (recruitCompanyInfo.workplace || "") === ""){
            alert('필수 항목을 모두 입력하시기 바랍니다.');
            return false;
        }

        if( !isNumberReg(recruitCompanyInfo.recruitNumber || 0)){
            alert('사원수를 확인해주시기 바랍니다.');
            return false; 
        }
        return result;
    }


    /** 저장버튼 */
    handleSave = () => {
        const {recruitCompanyInfo, serialNumber} = this.state;
        const {recruitCompanyData} = this.props;
        const  companyId  = storage.getCompanyId();
                
        const self = this;
        if(this.validation()){
            //원본과 input object비교
            if(!_.isEqual(recruitCompanyInfo, recruitCompanyData)){//데이터가 변경된 경우
                
                axios({
                    url:devtest() + `/companyRecruit/${serialNumber}/${companyId}`,
                    method : recruitCompanyData.companyId === ""|| recruitCompanyData.companyId === undefined? 'post': 'put',
                    data: recruitCompanyInfo,
                    headers: {  "Pragma": 'no-cache', 
                                "x-access-token": storage.getToken() }
                }).then(
                    (res)=>{
                        if(res.data){
                            //토큰 Refresh
                            storage.setSessionObj(res.headers);
                            alert("저장되었습니다.");

                            //모집공고 리스트 조회
                            this.handleGetRecruitNoticeList();
                        }
                    }
                )
                .catch((err)=>{/** Error Inceptor에서 처리 */
                    console.log( err.response);
                });
                self.setState({openCompanyInfoPopup:false})
                
            }else{
                alert("변경된 내용이 없습니다.");
                return;
            }
        }
    }

    /** 삭제버튼 */
    handleDelete = () => {
        const {recruitCompanyInfo, serialNumber} = this.state;
        const  companyId  = storage.getCompanyId();
                
        const self = this;
        
        axios({
                url:devtest() + `/companyRecruit/${serialNumber}/${companyId}`,
                method :"delete",
                data: recruitCompanyInfo,
                headers: {  "Pragma": 'no-cache', 
                            "x-access-token": storage.getToken() }
            }).then(
                (res)=>{
                    if(res.data){
                        //토큰 Refresh
                        storage.setSessionObj(res.headers);
                        //console.log('res.data', res.data);
                        alert("삭제되었습니다.");
                        this.handleGetRecruitNoticeList();
                    }
                }
            )
            .catch((err)=>{/** Error Inceptor에서 처리 */
                console.log( err.response);
            });
            self.setState({openCompanyInfoPopup:false})
        
    }

    render() { 
        const { handlePopupOpen
                , handlePopupClose
                , handleCompanyPopupClose
                , handleAddRecruitInfo
                , handleInputChange
                , handleSelectChange 
                , handleSave
                , handleDelete } = this;
        const { openPopup
                , openCompanyInfoPopup
                , recruits
                , code
                , recruitCompanyInfo
                , popupType } = this.state;
        const {recruitInfo} = this.props;
        return ( 
            <div className="sub-contents">
                <RecruitList recruitInfo={recruits} onPopup={handlePopupOpen} onAdd={handleAddRecruitInfo}></RecruitList>
                {/* /////////////////////////////////////////////////////////////////// */} 
                {openPopup && <RecruitPopup recruitInfo={recruitInfo} onClose={handlePopupClose}></RecruitPopup>}
                {/* /////////////////////////////////////////////////////////////////// */} 
                {openCompanyInfoPopup && <RecruitCompanyPopup 
                                            recruitInfo={recruitCompanyInfo} 
                                            onClose={handleCompanyPopupClose} 
                                            code={code}
                                            onInputChange = {handleInputChange}
                                            onSelectChange={handleSelectChange}
                                            onSave={handleSave}
                                            onDelete={handleDelete}
                                            popupType={popupType}></RecruitCompanyPopup>}
            </div>
         );
    }
}
 
// 컴포넌트에 리덕스 스토어를 연동해줄 때에는 connect 함수 사용
export default connect(
    (state) => ({
        recruitInfo: state.recruit.get('recruitInfo'),
        recruitCompanyData : state.recruit.get('recruitCompanyData'),
        userId : state.auth.get('userId'),
    }), (dispatch) => ({
        RecruitActions : bindActionCreators(recruitActions, dispatch),
        AuthActions: bindActionCreators(authActions, dispatch),
        CompanyActions : bindActionCreators(companyActions, dispatch),
    })
)(RecruitCompanyContainer);
