import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from 'modules/auth';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import storage from 'lib/storage';
import devtest from 'lib/devtest';

import {isEmail, isLength} from 'validator'; //문자열 검증

class MyPasswordContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            newPassword: "",
            newPasswordConfirm: "",
        }
    }

    componentDidMount() {

    }

    handleInputChange = (e) => {
        let input = {};
        input[e.target.name] = e.target.value;
        this.setState(input);
       
    }

    validate = () =>{
        const { password, newPassword, newPasswordConfirm } = this.state;
        
        const pwCheck = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
        if(!(password.length > 0 && newPassword.length > 0 && newPasswordConfirm.length > 0)){
            alert("비밀번호를 입력하세요.")
            return false;
        }
        if(!isLength(newPassword, { min: 8 })) {
            alert('비밀번호를 8자 이상 입력하세요.');
            return false;
        }
        if(!pwCheck.test(newPassword)){
            alert("비밀번호는 대문자, 소문자, 숫자가 각각 1개 이상씩 포함되어야 합니다.");
            return false;
        }
        if(password === newPassword) {
            alert('새로운 비밀번호는 현재 비밀번호와 같을 수 없습니다.');
            return false;
        }
        if(newPassword !== newPasswordConfirm) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return false;
        }
        return true;
    }

    handleChangePassword = () => {
        const self = this;
        const { password, newPassword, newPasswordConfirm } = this.state;
        //검증작업
        if(this.validate()){
            axios({
                url: devtest() +`/bpUser/changePassword`, 
                method : 'put',
                data : {
                    password: password,
                    newPassword: newPassword,
                    newPasswordConfirm: newPasswordConfirm,
                },
                headers: { "Pragma": 'no-cache', 
                            "x-access-token": storage.getToken() }
            }).then(
                (res)=>{
                    if(res.status == 200 && res.data.indexOf("fail to change password") > -1) {
                        storage.setSessionObj(res.headers);
                        alert("비밀번호 변경을 실패했습니다.");
                        return;
                    }
                    //현재 step과 url입력 step이 같을 경우 
                    storage.setSessionObj(res.headers);
                    alert("비밀번호가 변경되었습니다.");
                    self.props.history.push("/mypage");
                }
            ).catch(
                (err)=>{
                    //공통에러처리
                }
            );
        }
    }
    /** 취소버튼 */
    handleCancel = () => {
        this.props.history.push(`/mypage`);
    }

    /** Enter Key입력시 로그인 동작 */
    handleKeyPress = (e) => {
        if(e.charCode === 13){
            this.handleChangePassword();
        }
    }

    render() {
        const {handleChangePassword, handleCancel, handleInputChange, handleKeyPress} = this;
        return (
            <div className="sub-contents">
                <div className="sub-container">
                    <div className="location">
                        <div className="location-inner">
                            <div className="location-item">홈</div>
                            <div className="location-item">></div>
                            <div className="location-item">마이페이지</div>
                            <div className="location-item">></div>
                            <div className="location-item">비밀번호 변경</div>
                        </div>
                    </div>
                    <div className="sub-info">
                        <h2 className="sub_heading">비밀번호 변경</h2>
                        <div className="sub_heading_text">소중한 개인정보를 안전하게 관리하세요</div>
                        <br />
                    </div>
                    <div className="clear"></div>
                    <div className="sub_box">
                        <div className="apply_step4">
                        <div className="apply_step4_list">
                            <div className="apply_step4_table_title">비밀번호 변경</div>
                            <table className="join_table_contents">
                                <colgroup>
                                    <col width="174px"/>
                                    <col width=""/>
                                </colgroup>
                                <tbody> 
                                    <tr>
                                        <th scope="row">기존 비밀번호</th>
                                        <td>
                                            <div className="gt-f-l">
                                                <input className="text_inp_143px" type="password" name="password" placeholder="비밀번호 (8자이상)" onChange={handleInputChange}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>새 비밀번호</th>
                                        <td>
                                            <div className="gt-f-l">
                                            <input className="text_inp_143px" type="password" name="newPassword"  placeholder="새 비밀번호" onChange={handleInputChange}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>새 비밀번호 확인</th>
                                        <td>
                                            <div className="gt-f-l">
                                                <input className="text_inp_143px" type="password" name="newPasswordConfirm"  placeholder="새 비밀번호 확인" onKeyPress={handleKeyPress} onChange={handleInputChange}/>
                                            </div>
                                            <div className="gt-f-l join_description">
                                                    &nbsp;&nbsp;*대문자, 소문자, 숫자가 각각 1개 이상 포함 필수
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                        <div className="page_in_btn_area">
                            <div className="page_btn_box">
                                <a className="btn_full_cancel gt-f-l margin_right_20" onClick={handleCancel}>취소</a>
                                <a className="btn_full_join gt-f-l " onClick={handleChangePassword}>비밀번호 변경</a>
                            <div className="clear"></div>
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
        isLogin: state.auth.get('isLogin'),
        userId: state.auth.get('userId'),
        userType: state.auth.get('userType')

    }), (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch),
    })
)(MyPasswordContainer);
