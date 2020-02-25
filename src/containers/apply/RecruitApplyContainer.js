import React, { Component } from 'react';
import axios from  'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as recruitActions from 'modules/recruit';
import * as applyActions from 'modules/apply';
import * as authActions from 'modules/auth';
import * as menuActions from 'modules/menu';
import * as companyActions from 'modules/company';

import { RecruitApplyList, RecruitPopup } from 'components';
import storage from 'lib/storage';
import { formatWithOptions } from 'util';
import devtest from 'lib/devtest';

class RecruitApplyContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serialNumber:"",
            applyUserId:"",
            noticeImagePath: "",
            savedYn:false,
            openPopup: false, 
        }
    }
    /** 컴포넌트가 DOM위에 만들어지기 전에 실행 */
    componentDidMount() {
        this.setState({
            applyUserId: storage.getUserInfo(),
            //serialNumber: this.props.serialNumber
        })
       
        //모집공고 리스트 조회
        this.handleGetRecruitNoticeList();
        
    }

    /** 로그인 회사의 모집공고 리스트 조회 */
    handleGetRecruitNoticeList = () => {
        const { RecruitActions } = this.props;
        const self = this;
        const  companyId  = storage.getCompanyId();

        axios({
            url:devtest() +"/recruitNotice/companyNotice/"+companyId,
            method:"get",
            headers: { "Pragma": 'no-cache',
                       "x-access-token": storage.getToken()}
          })
        .then(function(response) {
          if (response == null){
            //   console.log('response null');
          }else {
              //조회한 데이터 store에 셋팅
              storage.setSessionObj(response.headers);
              RecruitActions.setRecruitNoticeList(response.data);
              self.getCompanyInfo(response.headers);

          }
        }).catch(function(error) {
          //공통에러처리 console.log(error);
        });
    }
    
    /** 모집공고 상세보기 팝업 */
    handlePopupOpen = (recruitInfo) => {
        const { RecruitActions } = this.props;
        // console.log(recruitInfo)
        RecruitActions.setRecruitNoticeInfo(recruitInfo);
        //팝업 visible true 셋팅
        this.setState({
            openPopup: true,
        });
    }

    /** 모집공고 상세보기 팝업 닫기 */
    handlePopupClose = () => {
        this.setState({openPopup:false})
    }

    /** 지원현황확인 버튼 클릭 */
    handleApplicantList = (recruitInfo) => {
        const self = this;
        const { ApplyActions,
                AuthActions, 
                 } = this.props;
        const { applyUserId
                 } = this.state;
        
        const  companyId  = storage.getCompanyId();

        const { RecruitActions } = this.props;
        
        

        //로그인 여부 체크
        if(applyUserId === null){
            this.props.history.push('/login');
            return;
        }

        const serialNumber = recruitInfo.serialNumber;
        ApplyActions.setSerialNumber(serialNumber);

        this.setState({
            serialNumber
        })

        axios({
            url: devtest() +`/recruitNotice/applyList/${serialNumber}/${companyId}`, 
            method : 'get',
            headers: { "Pragma": 'no-cache', 
                        "x-access-token": storage.getToken() }
        })
        .then(
            (res)=>{
                if(res){
                    storage.setSessionObj(res.headers);
                    RecruitActions.setRecruitNoticeInfo(recruitInfo);
                    ApplyActions.setApplyList(res.data);
                    this.props.history.push('/applylist');
                    
                    
                }
            }
        ).catch(
            (err)=>{
               //공통에러처리  if(err) console.log(err.response)
            }
        )
        
        //

    }


    /** 회사정보 조회 */
    getCompanyInfo = () => {
        const { CompanyActions } = this.props;
        const companyId = storage.getCompanyId();

        axios({
            url: devtest() + `/company/${companyId}`,
            method:"get",
            headers: {  "Pragma": 'no-cache', 
                        // "x-access-token": storage.getToken() 
                    }
        }).then(
            (res)=>{
                if(res.data) {
                    CompanyActions.setCompanyBasicInfo(res.data);
                }
            }
        ).catch(
            (err)=>{
                //공통에러처리
            }
        )
    }



    render() { 
        const { recruitNoticeList, recruitInfo } = this.props;
        const { handlePopupOpen, handlePopupClose, handleApplicantList } = this;
        const { noticeImagePath, openPopup} = this.state;
        return ( 
            <div className="sub-contents">
                <RecruitApplyList recruitInfo={recruitNoticeList} onPopup={handlePopupOpen} onApply={handleApplicantList}></RecruitApplyList>
                {openPopup && <RecruitPopup recruitInfo={recruitInfo} onClose={handlePopupClose} onApply={handleApplicantList}></RecruitPopup>}
            </div>
         );
    }
}
 
// 컴포넌트에 리덕스 스토어를 연동해줄 때에는 connect 함수 사용
export default connect(
    (state) => ({
        recruitNoticeList: state.recruit.get('recruitNoticeList'),
        recruitInfo : state.recruit.get('recruitInfo'),
        serialNumber: state.apply.get('serialNumber'),
        userId : state.auth.get('userId'),
        applyStatus : state.auth.get('applyStatus'),
        companyId: state.company.get("companyId")
    }), (dispatch) => ({
        RecruitActions : bindActionCreators(recruitActions, dispatch),
        ApplyActions : bindActionCreators(applyActions, dispatch),
        AuthActions: bindActionCreators(authActions, dispatch),
        MenuActions : bindActionCreators(menuActions, dispatch),
        CompanyActions : bindActionCreators(companyActions, dispatch),
    })
)(RecruitApplyContainer);
