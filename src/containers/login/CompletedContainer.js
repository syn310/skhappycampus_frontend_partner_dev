import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import {isEmail, isLength, isAlphanumeric} from 'validator'; //문자열 검증
import * as registerActions from 'modules/register';
import devtest from 'lib/devtest';

class CompletedContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
        }
    }

    /** 메인페이지로 이동  */
    handleGoToMainClick = () => {
        this.props.history.push("/");
    }

    render() { 

        const { handleGoToMainClick } = this;

        return ( 
            <div className="sub-contents">
                <div className="sub-container">
                    <div className="location">
                        <div className="location-inner">
                            <div className="location-item">홈</div>
                            <div className="location-item">></div>
                            <div className="location-item">회원가입</div>
                        </div>
                    </div>
                    <div className="sub-info">
                        <h2 className="sub_heading">회원가입</h2>
                        <div className="sub_heading_text">회원이 되어 다양한 서비스를 이용해보세요</div>
                        <div className="margin_bottom_37"></div>
                    </div>

                    <div className="clear"></div>


                    <div className="sub_box">
                        
                        <div className="apply_step4">
                            <div className="apply_step4_list">
                                    <div className="join_privercy_contract">
                                        <div className="term_of_service" style={{marginTop:"10px", border:"solid 1px #ccc", width:"96%",height:"150px", overflowY:"auto"}}>
                                            <p style={{color:"#111", fontSize:"22px", fontWeight:"600"}}>가입요청이 완료되었습니다.</p>
                                            <p>&nbsp; 관리자 승인 후 사이트 이용이 가능합니다.</p>
                                            <p>&nbsp; 연락처 : lee.sangil@sk.com</p>
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                        
                    <div className="page_in_btn_area">
                        <div className="page_btn_box">
                            <a className="btn_full_join gt-f-c" onClick={handleGoToMainClick}>메인화면으로 이동</a>
                        <div className="clear"></div>
                        </div>
                    </div>

                    <div className="join_page_description">
                        * 채용희망사 최초 회원의 경우 시스템관리자 승인이 있어야 가입이 완료되며,<br/>
                        그 이후에는 각 회사의 지정된 대표관리자의 승인이 필요합니다</div>
                    </div>
                    

                </div>
            </div>
         );
    }
}
 
export default connect(
    (state) => ({
    }), (dispatch) => ({
    })
)(CompletedContainer);
