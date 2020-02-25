import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as menuActions from 'modules/menu';
import * as MyQuestionActions from 'modules/myquestion';
import * as authActions from 'modules/auth';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { MyUserAprvList } from 'components';
import storage from 'lib/storage';
import devtest from 'lib/devtest';


class MyApplyContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userInfo: {
               applyUserId: "",
          },
          clickedQuestion: {},
          userList: [],
          managerYn: false
        }
    }

    componentDidMount() {

        let userTemp = this.state.userInfo;
        userTemp["applyUserId"] = storage.getUserInfo();
 
        this.setState({
            userInfo: userTemp
        })

        //가입신청 현황 조회
        this.getUserList();
    }
    /** 가입신청 현황 리스트 조회 */
    getUserList = () => {
        const  companyId  = storage.getCompanyId();
        const { userInfo } = this.state; 

        axios({
            url:  devtest() + '/bpUser/userList/' + companyId, 
            method : 'get',
            headers: {  "Pragma" : 'no-cache', 
                        "x-access-token": storage.getToken() 
                     }
        }).then(
            (res)=>{
                if(res){

                    this.setState({
                        userList: res.data
                    })

                    res.data.forEach((obj,idx)=>{
                        if(obj.userId===userInfo.applyUserId && obj.managerYn==="Y"){
                            this.setState({ //대표관리자일 경우 true 로 만들고 가입승인 테이블 생성
                                managerYn: true
                            })
                        }
                    })
                }
            }
        ).catch(
            (err) => {
                if(err) console.log(err.response)
            }
        )
    }

    /** 가입승인 요청이 있는 경우 TODO 표시 */
    toDoCheck = () => {

        const  companyId  = storage.getCompanyId();
        const { MenuActions } = this.props;

        axios({
            url:  devtest() +  '/bpUser/userList/' + companyId, 
            method : 'get',
            headers: {  "Pragma" : 'no-cache', 
                        "x-access-token": storage.getToken() 
                     }
        }).then(
            (res)=>{
                if(res){
                    MenuActions.setTodo(false);
                    const userData = res.data;
                    const todoIndex = _.findIndex(userData, function(arr) { return arr.aprvCompleteYn === "N"; });
                    
                    for(let i=0; i<userData.length; i++){
                        if(userData[i].userId===storage.getUserInfo() && userData[i].managerYn==="Y" && todoIndex > -1){
                            MenuActions.setTodo(true);
                        }
                    }

                }
                
            }
        ).catch(
            (err) => {
                if(err) console.log(err.response)
            }
        )
    }

    /** 비밀번호 변경 페이지 이동 */
    handleMoveToMyPassword= () => {
        this.props.history.push(`/mypass`);
    }
     /** 회사정보관리 페이지 이동 */
     handleMoveToCompanyInfo= () => {
        this.props.history.push(`/companyinfo`);
    }

    /** 가입승인 */
    approveClick = (rowInfo) => {
        const companyId = storage.getCompanyId();
        const self = this;

        if(rowInfo.row.aprvCompleteYn==="N"){
            if(confirm("승인하시겠습니까?"))
            axios({
                url: devtest() +'/bpUser/registPermit/'+ companyId,
                method : 'put',
                data : { userId: rowInfo.row.userId },
                headers: { "Pragma" : 'no-cache',
                            "x-access-token": storage.getToken() }
            }).then(
                (res)=>{
                    storage.setSessionObj(res.headers);
                    if(res.data){
                            alert("승인되었습니다");
                            self.toDoCheck();
                            self.getUserList();
                    }
                }
            ).catch(
                (err)=>{
                    //공통에러처리
                }
            )
        }

    }


    render() {

        const {
                handleMoveToMyPassword,
                handleMoveToCompanyInfo,
                approveClick
            } = this;

        const { 
                userList,
                managerYn
            } = this.state; 

        return (
            <div className="sub-contents">
                <div className="sub-container">
                    <div className="location">
                        <div className="location-inner">
                            <div className="location-item">홈</div>
                            <div className="location-item">></div>
                            <div className="location-item">마이페이지</div>
                        </div>
                    </div>
                    <div className="sub-info">
                        <h2 className="sub_heading">마이페이지</h2>
                        <div className="sub_heading_text">나의 정보를 관리하세요</div>
                        <br />
                    </div>
                    <div className="clear"></div>
                    <div className="sub_box">
                        {/* 가입신청 현황(대표관리자에게만 노출) */}
                        { managerYn ? <MyUserAprvList userList={userList} approveClick={approveClick}/> : undefined }
                        {/* 회사정보 관리 */}
                        <div className="apply_step4">
                            <div className="apply_step4_list">
                                <div>
                                    <div className="apply_step4_table_title">회사정보 관리<span>회사에 대한 정보를 관리할 수 있습니다</span></div>
                                    <div>
                                        <table className="apply_step4_table_contents">
                                            <tbody>
                                                <tr className="mypage_myinfo-item" onClick={handleMoveToCompanyInfo}>
                                                    <td>나의 회사정보</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>  
                        </div>
                        {/* 비밀번호 변경 */}
                        <div className="apply_step4">
                            <div className="apply_step4_list">
                                <div>
                                    <div className="apply_step4_table_title">개인정보 관리<span>소중한 개인정보를 안전하게 관리하세요</span></div>
                                    <div>
                                        <table className="apply_step4_table_contents">
                                            <tbody>
                                                <tr className="mypage_myinfo-item" onClick={handleMoveToMyPassword}>
                                                    <td>비밀번호 변경</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        
         );
    }
}

export default connect(
    (state) => ({
        myQuestionList: state.myquestion.get("myQuestionList"),
        serialNumber : state.apply.get('serialNumber'),
        isLogin: state.auth.get('isLogin'),
        userId: state.auth.get('userId'),
        companyId: state.company.get("companyId")

    }), (dispatch) => ({
        MyQuestionActions: bindActionCreators(MyQuestionActions, dispatch),
        MenuActions: bindActionCreators(menuActions, dispatch),
        AuthActions: bindActionCreators(authActions, dispatch),
    })
)(MyApplyContainer);
