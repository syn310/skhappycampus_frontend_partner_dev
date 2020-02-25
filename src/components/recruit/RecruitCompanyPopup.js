import React, { Component } from 'react';


const RecruitCompanyPopup = ({recruitInfo, onClose, code, onInputChange, onSelectChange, onSave, onDelete, popupType}) => {
    return (
        <div className="popup_wrap">
            <div>
                <div className="popup_area_notice">
                    {/* <!-- 팝업 헤더 시작 --> */}
                    <div className="popup_header">
                        <div className="popup_title gt-f-l">{`채용정보 ${popupType}`}</div>
                        <div className="popup_close" onClick={onClose}></div>
                        <div className="clear"></div>
                    </div>
                    {/* <!-- 팝업 헤더 끝 --> */}
                    {/* <!-- 팝업 컨텐츠 시작 --> */}
                    <div className="popup_contents">
                        {/* <div className="popup_contents_title">채용정보</div> */}
                        <div className="popup_contents_text">
                            <table className="apply_step5_table_contents">
                            <colgroup>
                                <col width="190px" />
                                <col width="334px" />
                                <col width="150px" />
                                <col width="334px" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">선호학력<span className="asterisk">*</span></th>
                                    <td name="enterDateInfo">
                                        <input type="text" name="preferDegree" className="text_inp_248px" value={recruitInfo.preferDegree|| "" } onChange={onInputChange}></input>
                                    </td>
                                    <th scope="row">채용인원<span className="asterisk">*</span></th>
                                    <td name="">
                                        <input type="number" name="recruitNumber" className="text_inp_248px" value={recruitInfo.recruitNumber|| "0" } onChange={onInputChange}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">정규직 전환연봉<span className="asterisk">*</span></th>
                                    <td name="enterDateInfo">
                                        <select title="" name="fulltimeSalaryStart" className="text_sel_120px margin_right_10" value={recruitInfo.fulltimeSalary ==undefined ?recruitInfo.fulltimeSalary ||"": recruitInfo.fulltimeSalary.split("~")[0]} onChange={onSelectChange}>
                                            {code.salaryCode.map(
                                                (obj,idx)=>{ 
                                                    if(obj.text === '선택')
                                                        return( <option value={obj.value} key={obj.value}>{obj.text}</option> ) 
                                                    else
                                                        return( <option value={obj.value} key={obj.value}>{obj.text}~</option> ) 
                                                }
                                            )}
                                            <option value="별도협의" key="TBD">별도협의</option>
                                        </select>
                                        <span className="margin_right_10">~</span>
                                        <select title="" name="fulltimeSalaryEnd" className="text_sel_120px" value={recruitInfo.fulltimeSalary ==undefined ?recruitInfo.fulltimeSalary ||"": recruitInfo.fulltimeSalary.split("~")[1]} onChange={onSelectChange}>
                                        {code.salaryCode.map(
                                            (obj,idx)=>{ 
                                                if(obj.text === '선택')
                                                    return( <option value={obj.value} key={obj.value}>{obj.text}</option> ) 
                                                else
                                                    return( <option value={obj.value} key={obj.value}>~{obj.text}</option> ) 
                                            }
                                        )}
                                        </select>
                                    </td>
                                    <th scope="row">근무지<span className="asterisk">*</span></th>
                                    <td name="">
                                        <input type="text" name="workplace" className="text_inp_248px" value={recruitInfo.workplace|| ""} onChange={onInputChange}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">모집직무<span className="asterisk">*</span></th>
                                    <td colSpan="3">
                                        <input type="text" name="recruitJob" className="text_inp_95pc" value={recruitInfo.recruitJob|| ""} onChange={onInputChange}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">상세업무<span className="asterisk">*</span></th>
                                    <td colSpan="3">
                                        <textarea type="text" name="jobDetail" className="textarea_95pc_60px" value={recruitInfo.jobDetail|| ""} onChange={onInputChange}></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">우대사항</th>
                                    <td colSpan="3">
                                        <textarea type="text" name="preferencePoint" className="textarea_95pc_60px" value={recruitInfo.preferencePoint|| ""} onChange={onInputChange}></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">비고</th>
                                    <td colSpan="3">
                                        <textarea type="textarea" name="remark" className="textarea_95pc_60px" value={recruitInfo.remark|| ""} onChange={onInputChange}></textarea>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                        </div>
                    </div>
                    {/* <!-- 팝업 컨텐츠 끝 --> */}
                    {/* <!-- 팝업 하단버튼 시작 --> */}
                    {/* { recruitInfo.noticeStatus === "진행중" ?  */}
                    { popupType === "수정" ?         
                            <div className="popup_button_notice_area">
                                <button className="popup_button_btns" onClick={onSave}>저장</button>
                                <button className="popup_button_btns" onClick={onDelete}>삭제</button>
                            </div>
                        : 
                        <div className="popup_button_notice_area">
                            <button className="popup_button_btn" onClick={onSave}>저장</button>
                        </div>
                    }
                    {/* } */}
                    {/* <!-- 팝업 하단버튼 끝 --> */}
                </div>
            </div>
        </div>
    )
}

export default RecruitCompanyPopup;

