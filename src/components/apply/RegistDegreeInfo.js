import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import {dateBarFormat} from 'lib/dateFormat';

//학력정보
const RegistDegreeInfo = ({degreeInfoArr}) => {

    const generateSchoolList = schoolList => {
        return schoolList.map(
            (obj, idx) => {
                return (
                    <table className="apply_step4_table_contents schoolTbl" key={obj.educationSeq} data-tbl={obj.educationSeq}>
                    <colgroup>
                        <col width="174px" />
                        <col width="334px" />
                        <col width="174px" />
                        <col width="334px" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">학력<span className="asterisk">*</span></th>
                            <td>
                                <input type="text" className="text_inp_disable_91pc" disabled value={obj.degree} ></input>
                            </td>
                            <th scope="row">졸업상태<span className="asterisk">*</span></th>
                            <td>
                                <input type="text" className="text_inp_disable_91pc" disabled value={obj.graduStatus}></input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">입학날짜<span className="asterisk">*</span></th>
                            <td>
                                <input type="text" name="enterDateInfo" className="text_inp_disable_91pc" disabled value={dateBarFormat(obj.enterDateInfo)} ></input>
                            </td>
                            <th scope="row">{obj.graduStatus==="졸업예정" ? "졸업예정날짜":"졸업날짜"}<span className="asterisk">*</span></th>
                            <td>
                                <input type="text" name="graduDateInfo" className="text_inp_disable_91pc" disabled value={dateBarFormat(obj.graduDateInfo)} ></input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">학교<span className="asterisk">*</span></th>
                            <td>
                                <input name="schoolName" className={obj.educationSeq==="1"? "text_inp_disable_91pc":"text_inp_disable_150px"} type="text" maxLength="30" disabled value={obj.schoolName} />
                                {obj.educationSeq==="1"? 
                                    undefined
                                        : 
                                    <div className="apply_radio_area" style={{"display":"inline-block", "marginLeft":"5px"}}>
                                        <input id={`mainCampusY_${obj.educationSeq}`} name={`mainCampusYn${obj.educationSeq}`} className="radio_18" type="radio" value="본교" checked={ obj[`mainCampusYn${obj.educationSeq}`] === "본교" ? true : false }  disabled />
                                        <label htmlFor={`mainCampusY_${obj.educationSeq}`}>본교</label>
                                        <span className="margin_right_5"></span>
                                        <input id={`mainCampusN_${obj.educationSeq}`} name={`mainCampusYn${obj.educationSeq}`} className="radio_18" type="radio" value="캠퍼스" checked={ obj[`mainCampusYn${obj.educationSeq}`] === "캠퍼스" ? true : false }  disabled />
                                        <label htmlFor={`mainCampusN_${obj.educationSeq}`}>캠퍼스</label>
                                    </div>
                                }
                            </td>
                            <th scope="row">전공</th>
                            <td> 
                               <input name="major" className="text_inp_disable_292px" type="text" maxLength="40" value={obj.major || ""} disabled />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">부전공</th>
                            <td>
                                <input name="minor" className="text_inp_disable_292px" type="text" maxLength="40" value={obj.minor || ""} disabled />
                            </td>
                            <th scope="row">복수전공</th>
                            <td>
                                <input name="doubleMajor" className="text_inp_disable_292px" type="text" value={obj.doubleMajor || ""} maxLength="40" disabled />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">학점</th>
                            <td>
                                <div className="gt-f-l">
                                        <input name="grade" className="text_inp_disable_122px" type="text" maxLength="10" disabled value={obj.grade || ""}  />
                                </div>
                                <div className="gt-f-l" style={{"margin" : "0 10px"}}>
                                    /
                                </div>
                                <div className="gt-f-l">
                                        <input name="perfectGrade" className="text_inp_disable_122px" type="text" maxLength="10" disabled value={obj.perfectGrade || ""}  />
                                </div>
                            </td>
                            <th scope="row">편입여부</th>
                            <td>
                                <div className="apply_radio_area">
                                    <input id={`transferY_${obj.educationSeq}`} name={`transferYn${obj.educationSeq}`} className="radio_18" type="radio" value="예" checked={ obj[`transferYn${obj.educationSeq}`] === "예" ? true : false } disabled />
                                    <label htmlFor={`transferY_${obj.educationSeq}`}>예</label>
                                    <span className="margin_right_10"></span>
                                    <input id={`transferN_${obj.educationSeq}`} name={`transferYn${obj.educationSeq}`} className="radio_18" type="radio" value="아니오" checked={ obj[`transferYn${obj.educationSeq}`] === "아니오" ? true : false } disabled />
                                    <label htmlFor={`transferN_${obj.educationSeq}`}>아니오</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                )
            }
        )
    }

    return(
        <div>
            {generateSchoolList(degreeInfoArr)} 
        </div>
    )


}

export default RegistDegreeInfo;