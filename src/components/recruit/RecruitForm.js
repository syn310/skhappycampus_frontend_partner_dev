import React from 'react';
import { dDayCount} from 'lib/dateTimeFormat';
import {dateBarFormat} from 'lib/dateFormat';

const RecruitForm = ({recruitInfo, onPopup, keyIdx, onAdd, popupType}) => {
    
    // console.log(keyIdx)
    /** 공고제목 클릭시  */
    const handlePopupClick = () => {
        onPopup(recruitInfo);
    }
    /** 채용정보 등록 버튼 클릭시 */
    const handleAddClick = (e) => {
        const popuptype = e.target.getAttribute("data-popuptype");
        onAdd(recruitInfo, popuptype);
    } 
    const create_btn = {
        "position": "absolute",
        "top": "50px", /* top: 2px; */
        "left": "920px",
        "float": "right",
        "textAlign": "center",
        "borderRadius": "50px",
        "backgroundColor": "#d0112b",
        "width": "80px",
        'height': "40px",
        'padding': "25px 6px 25px 5px", //"35px 8px 15px 3px", 
        'color': "#fff",
        "fontSize": "18px",
        "marginTop": `${keyIdx*128}px`,
        "cursor":"pointer"
    };

    const update_btn = {
        "position": "absolute",
        "top": "50px", /* top: 2px; */
        "left": "920px",
        "float": "right",
        "textAlign": "center",
        "borderRadius": "50px",
        "backgroundColor": "#eff0f2",
        "border": "2px solid #d0112b",
        "width": "80px",
        'height': "40px",
        'padding': "25px 6px 25px 5px", //"35px 8px 15px 3px", 
        'color': "#d0112b",
        "fontSize": "18px",
        "marginTop": `${keyIdx*128}px`,
        "cursor":"pointer"
    };

    const apply_end_btn = {
        "position": "absolute",
        "top": "50px",
        "left": "920px",
        "textAlign": "center",
        "borderRadius": "50px",
        "backgroundColor": "#a2a2a2",
        "width": "80px",
        "height": "40px",
        "padding": "34px 4px 16px 7px",
        "color": "#fff",
        "fontSize": "18px",
        "marginTop": `${keyIdx*128}px`
    };
    
    const padding_top_16 = {
        
        //"paddingTop": `${keyIdx*16}px`
        "paddingTop": (parseInt(`${keyIdx}`) === 0? '': `16px`)
    }
    
    return(
        <li style={padding_top_16}>   
            <div>
                <div className="apply_position_wide">인턴/신입</div>
                <div className="apply_title">
                    <span className="pointer" onClick={handlePopupClick}>{recruitInfo.noticeName}</span>
                    <span className="day">{dDayCount(recruitInfo.noticeEndDatetime)}</span>
                </div>
                <div className="apply_date">{dateBarFormat(recruitInfo.noticeStartDatetime)}~{dateBarFormat(recruitInfo.noticeEndDatetime)}</div>
            </div>
            { (recruitInfo.noticeStatus === "시작전" || recruitInfo.noticeStatus === "진행중") ?  
                (recruitInfo.inYn === 1? <div style={update_btn} onClick={handleAddClick} data-popuptype="수정">채용정보수정</div>
                : <div style={create_btn} onClick={handleAddClick} data-popuptype="등록">채용정보등록</div> )
                    :  <div style={apply_end_btn} >종료</div>}
        </li>
    )

}

export default RecruitForm;



