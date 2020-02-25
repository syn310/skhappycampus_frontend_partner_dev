/** 회사정보관리 화면 Container */
import React, { Component } from 'react';
import {CompanyInfo} from 'components';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { connect } from 'react-redux'; 
import * as companyActions from 'modules/company';
import devtest from 'lib/devtest';
import storage from 'lib/storage';
import {isNumberReg, isUrlReg} from 'lib/regex';

class CompanyInfoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyInfo: { //회사 기본정보
                companyId: "",
                companyName:"",
                companyType:"",
                companyAddress:"",
                companyGuide:"",
                companyUrl:"",
                contactPerson:"",
                contactPhone:"",
                idealType:"",
                sales:"",
                employeeNumber: "",
                companyLogoUrl: "",
            },
        }
    }

    componentDidMount = () => {
        //회사정보 조회
        this.getCompanyInfo();
    }
    
    /** 회사정보 조회 */
    getCompanyInfo = () => {
        const { CompanyAction } = this.props;
        const  companyId  = storage.getCompanyId();

        axios({
            url: devtest() + `/company/detail/${companyId}`,
            method:"get",
            headers: {  "Pragma": 'no-cache', 
                        "x-access-token": storage.getToken() }
        }).then(
            (res)=>{
                if(res.data) {
                    //store에 데이터 셋팅
                    CompanyAction.setCompanyBasicInfo(res.data);
                    //토큰 Refresh
                    storage.setSessionObj(res.headers);
                    //사용자에게 보여줄 companyInfo 데이터 셋팅
                    //console.log(res.data)
                    this.setState({
                        companyInfo: Object.assign({}, res.data),
                    });
                }
            }
        ).catch(
            (err)=>{
            }
        )
    }

    /** 취소버튼 */
    handleCancel = () => {
        if(confirm("작성중인 내용이 저장되지 않을 수 있습니다. 이동 전 저장 바랍니다. \n그래도 이동하시겠습니까 ?"))
            this.props.history.push('/');
    }
    /** 
     * 데이터 validation
     * 필수값 입력 확인
     * 사원수, 매출액 숫자만 입력
     * 홈페이지 주소 url 검증
     */
    validation = () => {
        let result = true;
        const {companyInfo} = this.state;
        if(companyInfo.companyName === ""
        || companyInfo.companyType === ""
        || companyInfo.companyAddress === ""
        || companyInfo.companyGuide === ""
        || companyInfo.companyUrl === ""
        || companyInfo.contactPerson === ""
        || companyInfo.contactPhone === ""
        || companyInfo.idealType === ""
        || companyInfo.sales === ""
        || companyInfo.employeeNumber === ""
        ){
            alert('내용을 모두 입력하시기 바랍니다.');
            return false;
        }
        if( !isNumberReg(companyInfo.employeeNumber)){
            alert('사원수를 확인해주시기 바랍니다.');
            return false; 
        }
        if( !isNumberReg(companyInfo.sales)) {
            alert('매출액을 확인해주시기 바랍니다.');
            return false; 
        }
        if(!isUrlReg(companyInfo.companyUrl)){
            alert('홈페이지 주소를 확인해주시기 바랍니다.');
            return false;
        }
        return result;
    }

    /** 저장버튼 */
    handleSave = () => {
        const {companyInfo} = this.state;
        const {companyBasicInfo} = this.props;
        const self = this;
        const companyId  = storage.getCompanyId();
        if(this.validation()){
            if(!this.handleDrop){
                alert('이미지 업로드에 실패하였습니다.')
                return;
            }
            //기존 데이터가 없는 경우
            axios({
                url:devtest() +  (companyBasicInfo.companyName.length == 0? `/company`: `/company/${companyId}`),
                method : companyBasicInfo.companyName.length == 0? 'post':'put',
                data: companyInfo,
                headers: {  "Pragma": 'no-cache', 
                            "x-access-token": storage.getToken() }
            }).then(
                (res)=>{
                    if(res.data){
                        //토큰 Refresh
                        storage.setSessionObj(res.headers);
                        self.getCompanyInfo();
                        alert("저장되었습니다.");
                    }
                }
            )
            .catch((err)=>{
                console.log( err.response);
            });
        }
    }
    /** 숫자만 입력하게 */
    handleKeyPress = (e) => {
        if(e.target.name === "employeeNumber" || e.target.name === "sales" || e.target.name === 'contactPhone'){
            let keyValue = e.charCode; 
            if( ((keyValue >= 48) && (keyValue <= 57)) ) {
                return true; 
            }else {
                e.preventDefault();
                return false;
            }
        }
    }

    handleChange = (e) => {
        let input = this.state.companyInfo;
        input[e.target.name] =  e.target.type === 'number' ? parseInt(e.target.value) : e.target.value; 
        this.setState({ companyInfo: input});
    }
    /** 이미지 업로드 */
    handleDrop = (pictureFiles, pictureBase64) => {
        const self = this;
        let result = false;
        // picutreFiles에 boundery 정보가 return 되고,
        // pictureBase64 에 base64 정보가 return 된다. 기본 array로 return
        /** Cloudinary로 전송 */
        if(pictureFiles.length > 1){
            alert('한 개의 이미지만 업로드 가능합니다.');
            return;
        }
        pictureFiles.map(image => {
            const formData = new FormData();
            formData.append("file", image);
            // formData.append("tags", '{TAGS}'); // Add tags for the images - {Array}
            formData.append("upload_preset", "skhappycampus12"); // Replace the preset name with your own
            formData.append("api_key", "217283749456682"); // Replace API key with your own Cloudinary API key
            formData.append("timestamp", (Date.now() / 1000) | 0);
            // Replace cloudinary upload URL with yours
            return axios.post(
                "https://api.cloudinary.com/v1_1/dlpg5kdj1/image/upload",
                formData, 
                { headers: { "X-Requested-With": "XMLHttpRequest" }
            }).then(
                (res)=>{
                    if(res.data){
                        //Display될 state변경
                        let input = self.state.companyInfo;
                        input['companyLogoUrl'] =  res.data.secure_url;
                        self.setState({ companyInfo: input});
                        result = true;
                    }
                }
            ).catch((err)=>{
                alert("문제가 발생하였습니다. 관리자에게 문의하세요.")
                console.log( err.response);
            });
        });
        return result;
    }
  
    render() { 
        const {handleCancel, handleSave, handleChange, handleKeyPress, handleDrop} = this;
        const {companyInfo} = this.state;
        const {companyBasicInfo} = this.props;

        return ( 
            <div>
                <div className="sub-contents">
                    <div className="sub-container">
                        <div className="location">
                            <div className="location-inner">
                                <div className="location-item">홈</div>
                                <div className="location-item">></div>
                                <div className="location-item">회사정보관리</div>
                            </div>
                        </div>
                        <div className="sub-info">
                            <h2 className="sub_heading">회사정보관리</h2>
                            <div className="sub_heading_text">회사에 대한 정보를 관리할 수 있습니다</div>
                            <br />
                        </div>
                        <div className="sub_box">
                            <div className="apply_step4">
                                <div className="apply_step4_list">
                                    <div>
                                        <div className="apply_step4_table_title">회사정보</div>
                                        <div className="line_2_gray"></div>
                                        <CompanyInfo companyInfo={companyInfo} 
                                            handleInputChange={handleChange} 
                                            handleKeyPress={handleKeyPress}
                                            onDrop={handleDrop}
                                            companyBasicInfo={companyBasicInfo}></CompanyInfo>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page_btn_area">
                            <div className="page_btn_box">
                                <span className="btn_full_save gt-f-l margin_right_20" onClick={handleCancel}>취소</span>
                                <span className="btn_full_next gt-f-l" onClick={handleSave}>저장</span>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}

export default connect(
    //props로 넣어줄 스토어 상태값
    (state) => ({
        companyBasicInfo: state.company.get("companyBasicInfo"),
        companyLogoUrl: state.company.get("companyLogoUrl"),
    })
    //props로 넣어줄 액션 생성함수
    , (dispatch) => ({
        CompanyAction : bindActionCreators(companyActions, dispatch),
    })
)(CompanyInfoContainer);
