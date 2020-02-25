import React from 'react';
import RecruitForm from './RecruitForm';

const RecruitList = ({recruitInfo, onPopup, onAdd}) => {

    const generateRecruitCard = recruitInfo => {
        return recruitInfo.map(
            (obj,idx)=>{
                return (
                        <RecruitForm  key={idx} keyIdx={idx} recruitInfo={obj} onPopup={onPopup} onAdd={onAdd} />
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
                        <div className="location-item">채용정보관리</div>
                    </div>
                </div>
                <div className="sub-info">
                    <h2 className="sub_heading">채용정보관리</h2>
                    <div className="sub_heading_text">회사 채용정보를 관리할 수 있습니다</div>
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

export default RecruitList;