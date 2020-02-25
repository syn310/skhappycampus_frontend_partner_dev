import React from 'react';
import ImageUploader from 'react-images-upload';

/** 회사정보 관리 */
const companyInfo = ({companyInfo, handleInputChange, handleKeyPress, onDrop, companyBasicInfo}) => {
    
    return (
        
        <table className="apply_step4_table_contents" >
            <colgroup>
                <col width="174px" />
                <col width="334px" />
                <col width="174px" />
                <col width="334px" />
            </colgroup>
            <tbody>
                <tr>
                    <th scope="row">회사명<span className="asterisk">*</span></th>
                    <td colSpan="3">
                        <input type="text" name="companyName" maxLength="10" className="text_inp_800px" value={companyInfo.companyName || "" } onChange={handleInputChange}></input>
                    </td>
                </tr>
                <tr>
                    <th scope="row">업종<span className="asterisk">*</span></th>
                    <td>
                        <input type="text" name="companyType" className="text_inp_292px" value={companyInfo.companyType|| "" } onChange={handleInputChange}></input>
                    </td>
                    <th scope="row">사원수(명)<span className="asterisk">*</span></th>
                    <td>
                        <input type="number" name="employeeNumber" className="text_inp_292px" onKeyPress={handleKeyPress} value={companyInfo.employeeNumber|| "0"} onChange={handleInputChange}></input>

                    </td>
                </tr>
                <tr>
                    <th scope="row">홈페이지<span className="asterisk">*</span></th>
                    <td>
                        <input type="text" name="companyUrl" maxLength="100" className="text_inp_292px" value={companyInfo.companyUrl|| ""} onChange={handleInputChange}></input>
                    </td>
                    <th scope="row">매출액(억원)<span className="asterisk">*</span></th>
                    <td>
                        <input type="number" name="sales" className="text_inp_292px" onKeyPress={handleKeyPress}  value={companyInfo.sales|| "0"} onChange={handleInputChange}></input>
                    </td>
                </tr>
                <tr>
                    <th scope="row">주소<span className="asterisk">*</span></th>
                    <td colSpan="3">
                        <input type="text" name="companyAddress" maxLength="100" className="text_inp_800px" value={companyInfo.companyAddress || ""} onChange={handleInputChange}></input>
                    </td>
                </tr>
                <tr>
                    <th scope="row">담당자명<span className="asterisk">*</span></th>
                    <td>
                        <input type="text" name="contactPerson" maxLength="50" className="text_inp_292px" value={companyInfo.contactPerson || ""} onChange={handleInputChange}></input>
                    </td>
                    <th scope="row">담당자 연락처<span className="asterisk">*</span></th>
                    <td>
                        <input type="text" name="contactPhone" maxLength="12" className="text_inp_292px" value={companyInfo.contactPhone || ""} onKeyPress={handleKeyPress} onChange={handleInputChange}></input>
                    </td>
                </tr>
                <tr>
                    <th scope="row">회사소개<span className="asterisk">*</span></th>
                    <td colSpan="3">
                        <textarea name="companyGuide" maxLength="200"  className="textarea_80" value={companyInfo.companyGuide|| ""} onChange={handleInputChange} placeholder="200자까지 입력가능합니다."></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row">인재상<span className="asterisk">*</span></th>
                    <td colSpan="3">
                        <textarea name="idealType" maxLength="100"  className="textarea_40" value={companyInfo.idealType|| ""} onChange={handleInputChange} placeholder="100자까지 입력가능합니다."></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row">회사로고<span className="asterisk">*</span></th>
                    <td colSpan="3">
                        {companyBasicInfo.companyLogoUrl !== "" &&  
                            <div style={{"textAlign":"center", "marginTop":"25px"}}>
                                <img height="90px" style={{"border":"0","boxShadow":"2px 2px 8px #c8c8c8"}} src={companyBasicInfo.companyLogoUrl}></img>
                                <div style={{"marginTop":"15px"}}>{"<현재이미지>"}</div>
                            </div>
                        }
                    {/* </td> */}
                    {/* <td > */}
                       <ImageUploader
                            fileContainerStyle={{'boxShadow':'0 0 0 0'}}
                            withIcon={true}
                            buttonText='이미지 변경'
                            onChange={onDrop}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={1048576}
                            accept="accept=image/*"
                            label='* 업로드 최대 크기: 1MB, 업로드 가능 확장자: jpg/gif/png, 권장비율: 가로:세로=19:10'
                            // labelStyles={{'color': 'red'}}
                            labelClass='join_description'
                            singleImage={true} /** 이미지 1개만 업로드 */
                            withPreview={true} /** 업도르한 이미지 미리보기 설정 */
                            fileSizeError='1MB까지 업로드가능 합니다.'
                            fileTypeError='해당 확장자를 지원하지 않습니다.'
                        />
                        
                    </td>
                </tr>
            </tbody>
        </table>
    )


}

export default companyInfo;