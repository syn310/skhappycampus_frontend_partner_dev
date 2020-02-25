import React, { Component } from 'react';
import RecruitApplyForm from './RecruitApplyForm';

const RecruitApplyList = ({recruitInfo, onPopup, onApply}) => {

    const generateRecruitCard = recruitInfo => {
        return recruitInfo.map(
            (obj,idx)=>{
                return (
                        <RecruitApplyForm  key={idx} keyIdx={idx} recruitInfo={obj} onPopup={onPopup} onApply={onApply} />
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
                        <div className="location-item">지원현황</div>
                    </div>
                </div>
                <div className="sub-info">
                    <h2 className="sub_heading">지원현황</h2>
                    <div className="sub_heading_text">우리 회사가 참여한 공고의 지원현황을 확인하세요</div>
                    <br />
                </div>
                <div className="clear"></div>
                <div className="sub_box">
                        <div className="apply_area">
                            <ul className="apply_list">
                                 {generateRecruitCard(recruitInfo)} 
                            </ul>
                        </div>
                    </div>
            </div>

    )
}

export default RecruitApplyList;