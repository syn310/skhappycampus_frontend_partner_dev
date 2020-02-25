import React, { Component } from 'react';
import { dateToBarFormat} from 'lib/dateFormat';

const NoticeForm = ({noticeInfo, onPopup, keyIdx}) => {  
    const handlePopupClick = () => {
        onPopup(noticeInfo);
    }

    return(
        <li key={keyIdx} style={{paddingTop:"10px"}} >
                <div className="page_btn_area_notice"> 
                    <div className="btn_full_white_round gt-f-l margin_right_20">{noticeInfo.noticeCategory}</div>
                </div>
                <div className="apply_title" style={{"paddingTop":"0px"}}>
                    <span className="pointer" onClick={handlePopupClick}>{noticeInfo.noticeTitle}</span>
                    { keyIdx == 1?<span className="day">New</span> : <span></span> }
                </div>
                <div className="apply_date">{dateToBarFormat(noticeInfo.createDatetime)}</div>
        </li>
    )

}

export default NoticeForm;



