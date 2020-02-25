import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import {dateFormat, dateBarFormat} from 'lib/dateFormat';

//자격증
const RegistExtraCert = ({extraCertArr}) => {

    const generateTableTr = extraCertArr => {
        return extraCertArr.map(
            (obj, idx) => {
                return (
                    <tr key={obj.certificateSeq} data-row={obj.certificateSeq}>
                        <td><input name="certificateContent" className="text_inp_disable_91pc" type="text" maxLength="100" value={obj.certificateContent || ""} disabled /></td>
                        <td><input name="certificateDate" className="text_inp_disable_95px" type="text" maxLength="100" value={dateBarFormat(obj.certificateDate || "" )} disabled /></td>
                        <td><input name="certificateGrade" className="text_inp_disable_95px" type="text" maxLength="100" value={obj.certificateGrade|| ""} disabled /></td>
                        <td style={{"borderRight": "0"}}>
                            <input name="certificateOrganization" className="text_inp_disable_248px" type="text" maxLength="100" value={obj.certificateOrganization|| ""} disabled />
                        </td>
                    </tr>
                )
            }
        )
    }


    return(
        <div>
            <table id="extraCertTable" className="apply_step4_table2_contents">
                <colgroup>
                    <col width="409px" />
                    <col width="126px" />
                    <col width="126px" />
                    <col width="273px" />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">자격 및 내역</th>
                        <th scope="row">취득날짜</th>
                        <th scope="row">등급</th>
                        <th scope="row" style={{"borderRight": "0"}}>발급기관</th>
                    </tr>
                    { extraCertArr && extraCertArr.length != 0 ? generateTableTr(extraCertArr) : undefined}
                </tbody>
            </table>
        </div>
    )


}

export default RegistExtraCert;