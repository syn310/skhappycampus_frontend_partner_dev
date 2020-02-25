import React, { Component } from 'react';
import axios from  'axios';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import storage from 'lib/storage';
import devtest from 'lib/devtest';
import {NoticeList, NoticePopup} from 'components';

class NoticeContainer extends Component {

    /** 생성자 */
    constructor(props) {
        super(props);
        this.state = {
          code : {
            qnaCategoryCode : []
          },
          notices: [],
          noticeInfo: {},
          openPopup: false,
        };
    }

    componentDidMount() {
        //렌더링 전에 공지사항 리스트 조회
        this.handleGetNoticeList();
    }

     /** 공지사항 리스트 조회 */
     handleGetNoticeList = () => {
        axios({
          url: devtest() + `/notice`,
          method:"get",
          headers: {  "Pragma": 'no-cache', 
                      "x-access-token": storage.getToken()  }
        })
        .then((response) => {
          if (response.data){
            storage.setSessionObj(response.headers);
              this.setState({
                notices: response.data
              });
          }
        }).catch((error) => {
          console.log(error);
        });
    }

    /** 공지사항 상세보기 팝업 */
    handlePopupOpen = (noticeInfo) => {
        //팝업 visible true 셋팅
        this.setState({
            openPopup: true,
            noticeInfo: noticeInfo
        });
    }

    /** 공지사항 상세보기 팝업 닫기 */
    handlePopupClose = () => {
        this.setState({openPopup:false})
    }

    render() {
        const { notices, openPopup, noticeInfo } = this.state;
        const { handlePopupOpen, handlePopupClose } = this;
        return (
            <div className="sub-contents">
                <NoticeList notices={notices} onPopup={handlePopupOpen}></NoticeList>
                {openPopup && <NoticePopup noticeInfo={noticeInfo} onClose={handlePopupClose}></NoticePopup>}
            </div>
        );
    }
}

export default connect(
    //props로 넣어줄 스토어 상태값
    (state) => ({
    })
    //props로 넣어줄 액션 생성함수
    , (dispatch) => ({
    })
)(NoticeContainer);
