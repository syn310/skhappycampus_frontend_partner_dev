import React, { Component } from 'react';
import NoticeForm from './NoticeForm';

const NoticeList = ({notices, onPopup}) => {
    const generateNoticeCard = (notices) => {
        return notices.map(
            (obj,idx)=>{
                return (
                    <NoticeForm  key={idx} keyIdx={idx} noticeInfo={obj} onPopup={onPopup}/>
                )
            }
        )
    }
    return (
        <div className="sub-container">
            <div className="location">
                <div className="location-inner">
                    <div className="location-item">홈</div>
                    <div className="location-item">></div>
                    <div className="location-item">행복성장캠퍼스 소식</div>
                </div>
            </div>
            <div className="sub-info">
                <h2 className="sub_heading">행복성장캠퍼스 소식</h2>
                <div className="sub_heading_text">행복성장캠퍼스의 새로운 소식을 확인해보세요</div>
                <br />
            </div>
            <div className="clear"></div>
            <div className="sub_box">
                <div className="apply_area">
                    <ul className="apply_list">
                        {generateNoticeCard(notices)}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NoticeList;