import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ApplyListTable } from 'components'
import * as applyActions from 'modules/apply';
import * as menuActions from 'modules/menu';
import * as companyActions from 'modules/company';
import * as authActions from 'modules/auth';
import { bindActionCreators } from 'redux';
import axios from  'axios';
import devtest from 'lib/devtest';
import storage from 'lib/storage';
import { Document, Packer, Paragraph, WidthType } from 'docx-es5';
import { saveAs } from 'file-saver';
import { dateBarFormat } from 'lib/dateFormat';


class ApplyListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            applyList: [],
            filtering: false,
            basicInfo: { //지원자 기본정보
                serialNumber:"",
                applyUserId:"",
                applyName:"",
                applyNationality:"대한민국",
                applyBirth:"",
                applyGender:"",
                applyPhone:"",
                applyAddress:"",
                //applyAddressDetail:"",
                applyStatus:"3",
                disabilityYn:"",
                militaryYn:"",
                veteransYn:""
            },
            degreeInfoArr : [ //지원자 학력정보 고등학교는 필수
                    {
                        serialNumber:"",
                        applyUserId:"",
                        educationSeq:"1",
                        degree:"",
                        graduStatus:"",
                        enterDateInfo:"",
                        graduDateInfo:"",
                        schoolName:"",
                        major:"",
                        minor:"",
                        doubleMajor:"",
                        grade:"",
                        perfectGrade:"",
                        transferYn1:"아니오",
                        mainCampusYn1:"본교"
                    }
                    
            ], 
            extraCertArr: [] //지원자 추가 자격정보 (선택사항)

         }
    }

    componentDidMount = () => {
        this.setState({
            applyList: this.props.applyList
        });
        //console.log(this.props.applyList)
        window.scrollTo(0, 0);
    }



    renderEditableSelect = (cellInfo) => {


        return (
            <div>
                <select 
                    className="selectric_apply"
                    contentEditable 
                    suppressContentEditableWarning
                    onChange={e => {
                        let applyList = _.cloneDeep(this.state.applyList);

                        //서류결과가 진행중인데 면접결과 등록할 경우
                        if( cellInfo.column.id=="interviewStatus" && 
                            e.currentTarget.value.length > 0 && 
                            applyList[cellInfo.index]["documentStatus"].length == 0 
                         ){
                            alert("서류결과를 먼저 입력해야합니다");
                            return;
                        }
                        //서류/면접 진행중인데 최종결과 등록할 경우
                        else if( cellInfo.column.id=="finalStatus" && 
                            e.currentTarget.value.length > 0 && 
                            (applyList[cellInfo.index]["documentStatus"].length == 0  || applyList[cellInfo.index]["interviewStatus"].length == 0 )
                         ){
                            alert("서류 및 면접 결과를 먼저 입력해야합니다");
                            return;
                        }
                        else{
                            applyList[cellInfo.index]["changeYn"] = "Y";
                            applyList[cellInfo.index][cellInfo.column.id] = e.currentTarget.value;
                            this.setState({ applyList });
                        }
                    }}
                    value={ this.state.applyList[cellInfo.index][cellInfo.column.id] }
                    >
                        <option value="">진행중</option>
                        <option value="합격">합격</option>
                        <option value="불합격">불합격</option>
                </select>
            </div>

        );
      }


    clickApplyDetail = (rowInfo) => {
        const { ApplyActions } = this.props;

        const applyObj = {
            applyUserId: rowInfo.value.applyUserId,
            serialNumber : rowInfo.value.serialNumber,
            applyName: rowInfo.value.applyName
        }

        ApplyActions.setApplyDetail(applyObj);
        this.props.history.push("/applydetail")
    }

    clickApplyDownload = (rowInfo) => {
        this.getBasicInfo(rowInfo);
    }


    //기본정보 가져오기
    getBasicInfo = (rowInfo) => {

        const self = this;
        const { serialNumber } = this.props;
        const { applyUserId } = rowInfo.original; 

        axios({
            url: devtest() +  `/apply/${serialNumber}/${applyUserId}`,
            method : 'get',
            headers: {  "Pragma": 'no-cache',
                        "x-access-token": storage.getToken() 
                     }
        }).then(
            (res)=>{
                if(res.data){
                    let phoneNumber = res.data.applyPhone; 
                    res.data["applyPhone"] = phoneNumber.length == 0 ? "" : phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 7) + "-" + phoneNumber.substring(7, 11);
                    
                    //ApplyActions.setApplyInfo(res.data);
                    this.setState({
                        basicInfo: res.data
                    })
                    self.getDegreeInfoArr(res.headers, applyUserId);

                }
                
            }
        )
        .catch((err)=>{

        })

    }

    //학력정보 가져오기
    getDegreeInfoArr = (header, applyUserId) => {

        const { basicInfo } = this.state; 
        const { ApplyActions, AuthActions, MenuActions } = this.props;
        const { serialNumber } = this.props;
        const self = this;

        axios({
            url: devtest() +  `/applyEducation/${serialNumber}/${applyUserId}`, 
            method : 'get',
            headers: {  
                        "Pragma": 'no-cache',
                        "x-access-token":  header.newtoken 
                     }
        }).then(
            (res)=>{
                if(res.data){
                    if(res.data.length == 0){

                        const degreeInfoArr = [ //지원자 학력정보 고등학교는 필수 -> 무조건 넣는다
                                            {
                                                serialNumber: basicInfo.serialNumber,
                                                applyUserId: basicInfo.applyUserId,
                                                educationSeq:"1",
                                                degree:"고등학교",
                                                graduStatus:"졸업",
                                                enterDateInfo:"",
                                                graduDateInfo:"",
                                                schoolName:"",
                                                major:"",
                                                minor:"",
                                                doubleMajor:"",
                                                grade:"",
                                                perfectGrade:"",
                                                transferYn1:"아니오",
                                                mainCampusYn1:"본교",
                                            }
                                ];

                        ApplyActions.setDegreeInfo(degreeInfoArr);
                        this.setState({
                            degreeInfoArr
                        })
                    }else{

                        //본교/캠퍼스 , 편입여부 radio name과 state의 mainCampusYn, transferYn을 동일형태로 넣어주기 위함.
                        let degreeAfter = []; //_.cloneDeep(res.data);
                        res.data.forEach((obj,idx) => {
                            const transferVal = obj.transferYn;
                            const mainCampusVal = obj.mainCampusYn;
                            obj[`transferYn${obj.educationSeq}`] = transferVal;
                            obj[`mainCampusYn${obj.educationSeq}`] = mainCampusVal;
                            degreeAfter.push(obj)
                        })

                        //위 작업을 지나면 degreeInfo에는 transferYn 과 transterYn${educationSeq} 형태의 두가지가
                        //존재하게됨. 하지만 실제로 사용하는 애는 후자이므로. 아래 validation에서 transferYn는 빼고체크함
                        
                        this.setState({
                            degreeInfoArr: degreeAfter
                        })
                    }
                    self.getExtraCertArr(res.headers, applyUserId); //추가자격증정보

                }

            }
        ).catch((err)=>{
            //공통에러처리
        })


    }

    //자격증정보 가져오기
    getExtraCertArr = (header, applyUserId) => {

        const self = this;
        const { ApplyActions, MenuActions, AuthActions } = this.props;
        const { serialNumber } = this.props;

        axios({
            url:devtest() +  `/applyCertificate/${serialNumber}/${applyUserId}`, 
            method : 'get',
            headers: {  
                        "Pragma": 'no-cache',
                        "x-access-token": header.newtoken 
                     }
        }).then(
            (res)=>{
                if(res.data){
                    storage.setSessionObj(res.headers);
                    //ApplyActions.setCertInfo(res.data);
                    this.setState({
                        extraCertArr: res.data
                    })
                    self.makeWordDocx();

                }

            }
        )
        .catch((err)=>{
            //공통에러처리
        })

    }

    makeWordDocx = () => {

        const { basicInfo, degreeInfoArr, extraCertArr } = this.state;

        //아이디를 각각 가져오기 위한 dummy obj
        //학력용
        const degreeTableNo = {
            "0":"degreeTbl0",
            "1":"degreeTbl1",
            "2":"degreeTbl2",
            "3":"degreeTbl3",
            "4":"degreeTbl4",
            "5":"degreeTbl5",
            "6":"degreeTbl6",
            "7":"degreeTbl7",
            "8":"degreeTbl8",
            "9":"degreeTbl9",
        };

        //자격증용
        const certTableNo = {
            "0":"certInfoTbl0",
            "1":"certInfoTbl1",
            "2":"certInfoTbl2",
            "3":"certInfoTbl3",
            "4":"certInfoTbl4",
            "5":"certInfoTbl5",
            "6":"certInfoTbl6",
            "7":"certInfoTbl7",
            "8":"certInfoTbl8",
            "9":"certInfoTbl9",
        };

        const doc = new Document();
        const titlePara = new Paragraph();
        titlePara.createTextRun("                  [행복성장캠퍼스 입사지원서]").bold().size(40);
        doc.addParagraph(titlePara);

        //blank line
        const blankLine0 = new Paragraph()
        blankLine0.createTextRun("").bold().size(30);
        doc.addParagraph(blankLine0);
        //blank line
        const blankLine = new Paragraph()
        blankLine.createTextRun("").bold().size(30);
        doc.addParagraph(blankLine);

        /////////////// 지원자정보 /////////////////
        const basicTblTitle = new Paragraph()
        basicTblTitle.createTextRun("지원자정보").bold().size(30);
        doc.addParagraph(basicTblTitle);

        const basicInfoTbl = doc.createTable(5, 4);
        basicInfoTbl.setWidth(WidthType.PERCENTAGE, '100%');
        basicInfoTbl.getCell(0,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(0,0).addContent(new Paragraph("성명"));
        basicInfoTbl.getCell(0,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(0,1).addContent(new Paragraph(basicInfo.applyName));
        basicInfoTbl.getCell(0,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(0,2).addContent(new Paragraph("이메일"));
        basicInfoTbl.getCell(0,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(0,3).addContent(new Paragraph(basicInfo.applyUserId));

        basicInfoTbl.getCell(1,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(1,0).addContent(new Paragraph("연락처"));
        basicInfoTbl.getCell(1,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(1,1).addContent(new Paragraph(basicInfo.applyPhone));
        basicInfoTbl.getCell(1,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(1,2).addContent(new Paragraph("주소"));
        basicInfoTbl.getCell(1,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(1,3).addContent(new Paragraph(basicInfo.applyAddress));

        basicInfoTbl.getCell(2,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(2,0).addContent(new Paragraph("국적"));
        basicInfoTbl.getCell(2,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(2,1).addContent(new Paragraph(basicInfo.applyNationality));
        basicInfoTbl.getCell(2,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(2,2).addContent(new Paragraph("장애여부"));
        basicInfoTbl.getCell(2,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(2,3).addContent(new Paragraph(basicInfo.disabilityYn));

        basicInfoTbl.getCell(3,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(3,0).addContent(new Paragraph("생년월일"));
        basicInfoTbl.getCell(3,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(3,1).addContent(new Paragraph(dateBarFormat(basicInfo.applyBirth)));
        basicInfoTbl.getCell(3,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(3,2).addContent(new Paragraph("병역여부"));
        basicInfoTbl.getCell(3,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(3,3).addContent(new Paragraph(basicInfo.militaryYn));

        basicInfoTbl.getCell(4,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(4,0).addContent(new Paragraph("성별"));
        basicInfoTbl.getCell(4,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(4,1).addContent(new Paragraph(basicInfo.applyGender));
        basicInfoTbl.getCell(4,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
        basicInfoTbl.getCell(4,2).addContent(new Paragraph("보훈대상여부"));
        basicInfoTbl.getCell(4,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
        basicInfoTbl.getCell(4,3).addContent(new Paragraph(basicInfo.veteransYn));

        /////////////////////////////////////////////////////////////

        //blank line
        const blankLine1 = new Paragraph()
        blankLine1.createTextRun("").bold().size(30);
        doc.addParagraph(blankLine1);

        /////////////// 학력정보 ////////////////////
        const degreeTblTitle = new Paragraph()
        degreeTblTitle.createTextRun("학력사항").bold().size(30);
        doc.addParagraph(degreeTblTitle);

        for(let i=0; i<degreeInfoArr.length; i++){
            degreeTableNo[i] = doc.createTable(6, 4);
            degreeTableNo[i].setWidth(WidthType.PERCENTAGE, '100%');
            degreeTableNo[i].getCell(0,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(0,0).addContent(new Paragraph("학력"));
            degreeTableNo[i].getCell(0,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(0,1).addContent(new Paragraph(degreeInfoArr[i].degree));
            degreeTableNo[i].getCell(0,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(0,2).addContent(new Paragraph("학교명"));
            degreeTableNo[i].getCell(0,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(0,3).addContent(new Paragraph(degreeInfoArr[i].schoolName));

            degreeTableNo[i].getCell(1,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(1,0).addContent(new Paragraph("졸업상태"));
            degreeTableNo[i].getCell(1,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(1,1).addContent(new Paragraph(degreeInfoArr[i].graduStatus));
            degreeTableNo[i].getCell(1,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(1,2).addContent(new Paragraph("입학날짜"));
            degreeTableNo[i].getCell(1,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(1,3).addContent(new Paragraph(dateBarFormat(degreeInfoArr[i].enterDateInfo)));

            degreeTableNo[i].getCell(2,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(2,0).addContent(new Paragraph("졸업날짜"));
            degreeTableNo[i].getCell(2,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(2,1).addContent(new Paragraph(dateBarFormat(degreeInfoArr[i].graduDateInfo)));
            degreeTableNo[i].getCell(2,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(2,2).addContent(new Paragraph("캠퍼스구분"));
            degreeTableNo[i].getCell(2,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(2,3).addContent(new Paragraph(degreeInfoArr[i].mainCampusYn));

            degreeTableNo[i].getCell(3,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(3,0).addContent(new Paragraph("전공"));
            degreeTableNo[i].getCell(3,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(3,1).addContent(new Paragraph(degreeInfoArr[i].major));
            degreeTableNo[i].getCell(3,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(3,2).addContent(new Paragraph("부전공"));
            degreeTableNo[i].getCell(3,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(3,3).addContent(new Paragraph(degreeInfoArr[i].minor));

            degreeTableNo[i].getCell(4,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(4,0).addContent(new Paragraph("복수전공"));
            degreeTableNo[i].getCell(4,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(4,1).addContent(new Paragraph(degreeInfoArr[i].doubleMajor));
            degreeTableNo[i].getCell(4,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(4,2).addContent(new Paragraph("학점"));
            degreeTableNo[i].getCell(4,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(4,3).addContent(new Paragraph(degreeInfoArr[i].degree==="고등학교"? "" : `${degreeInfoArr[i].grade} / ${degreeInfoArr[i].perfectGrade}`));

            degreeTableNo[i].getCell(5,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(5,0).addContent(new Paragraph("편입여부"));
            degreeTableNo[i].getCell(5,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(5,1).addContent(new Paragraph(degreeInfoArr[i].degree==="고등학교"? "" : degreeInfoArr[i].transferYn));
            degreeTableNo[i].getCell(5,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
            degreeTableNo[i].getCell(5,2).addContent(new Paragraph(""));
            degreeTableNo[i].getCell(5,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
            degreeTableNo[i].getCell(5,3).addContent(new Paragraph(""));

            const blankLine2 = new Paragraph()
            blankLine2.createTextRun("").bold().size(30);
            doc.addParagraph(blankLine2);

        }

        ///////////////////////// 자격증 정보 ////////////////////////////////////

        const certTblTitle = new Paragraph()
        certTblTitle.createTextRun("자격증").bold().size(30);
        doc.addParagraph(certTblTitle);

        if(extraCertArr.length > 0){

            for(let i=0; i<extraCertArr.length; i++){

                certTableNo[i] = doc.createTable(2, 4);
                certTableNo[i].setWidth(WidthType.PERCENTAGE, '100%');
                certTableNo[i].getCell(0,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
                certTableNo[i].getCell(0,0).addContent(new Paragraph("자격 및 내역"));
                certTableNo[i].getCell(0,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
                certTableNo[i].getCell(0,1).addContent(new Paragraph(extraCertArr[i].certificateContent));
                certTableNo[i].getCell(0,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
                certTableNo[i].getCell(0,2).addContent(new Paragraph("취득날짜"));
                certTableNo[i].getCell(0,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
                certTableNo[i].getCell(0,3).addContent(new Paragraph(dateBarFormat(extraCertArr[i].certificateDate)));

                certTableNo[i].getCell(1,0).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
                certTableNo[i].getCell(1,0).addContent(new Paragraph("등급"));
                certTableNo[i].getCell(1,1).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
                certTableNo[i].getCell(1,1).addContent(new Paragraph(extraCertArr[i].certificateGrade));
                certTableNo[i].getCell(1,2).CellProperties.setWidth('15%', WidthType.PERCENTAGE).setShading({"fill":"#d6d6d6"}).setVerticalAlign("center");
                certTableNo[i].getCell(1,2).addContent(new Paragraph("발급기관"));
                certTableNo[i].getCell(1,3).CellProperties.setWidth('35%', WidthType.PERCENTAGE).setVerticalAlign("center");
                certTableNo[i].getCell(1,3).addContent(new Paragraph(extraCertArr[i].certificateOrganization));

                const blankLine3 = new Paragraph()
                blankLine3.createTextRun("").bold().size(30);
                doc.addParagraph(blankLine3);

            }
        } else {
            const noExtra = new Paragraph()
            noExtra.createTextRun("없음").size(19);
            doc.addParagraph(noExtra);

            const blankLine3 = new Paragraph()
            blankLine3.createTextRun("").bold().size(30);
            doc.addParagraph(blankLine3);
        }
        
        ////////////////////// 자기소개서 ///////////////////////////

        const coverLetterTitle = new Paragraph()
        coverLetterTitle.createTextRun("자기소개서").bold().size(30);
        doc.addParagraph(coverLetterTitle);

        const coverLetterContent = new Paragraph()
        coverLetterContent.createTextRun(basicInfo.coverLetter).size(19)
        doc.addParagraph(coverLetterContent);

        /////////////////////////////////////////////////////////////

        const packer = new Packer();

        packer.toBlob(doc).then(blob => {
            saveAs(blob, `행복성장캠퍼스_${basicInfo.applyName}.docx`);
        });


    }

    clickFilter = (e) => {
        this.setState({
            filtering : !this.state.filtering
        })
    }

    clickSave = (e) => {

        const  companyId  = storage.getCompanyId();
        const { applyList } = this.state;

        const self = this;

        if(confirm("변경사항을 저장하시겠습니까?"))
            axios({
                url: devtest() +'/applyUserCompanyStatus/' + companyId,
                method : 'put',
                data : { applyList },
                headers: {  "Pragma": 'no-cache', 
                            "x-access-token": storage.getToken()  }
            }).then(
                (res)=>{
                    if(res.data){
                        storage.setSessionObj(res.headers);
                        alert("저장되었습니다");
                        self.getApplyList();
                        
                    }
                }
            ).catch(
                (err)=>{
                   //공통에러처리 if(err) console.log("업데이트 에러", err.response)
                }
            )
    }


    getApplyList = () => {

        const { serialNumber } = this.props;
        const  companyId  = storage.getCompanyId();

        axios({
            url: devtest() +`/recruitNotice/applyList/${serialNumber}/${companyId}`, 
            method : 'get',
            headers: { "Pragma": 'no-cache', 
                        "x-access-token": storage.getToken() 
                    }
        })
        .then(
            (res)=>{
                if(res){
                    storage.setSessionObj(res.headers);
                    this.setState({
                        applyList: res.data
                    })
                    
                }
            }
        ).catch(
            (err)=>{
                if(err) console.log(err)
            }
        )

    }

    /** 취소버튼 */
    handleBack = () => {
        if(confirm("작성중인 내용이 저장되지 않을 수 있습니다. 이동 전 저장 바랍니다. \n그래도 이동하시겠습니까?"))
            this.props.history.push('/recruitlist');
    }



    render() { 

        const { renderEditableSelect,
                clickApplyDetail,
                clickApplyDownload,
                clickFilter ,
                clickSave,
                handleBack} = this;

        const { applyList,
                filtering } = this.state;

        const { companyBasicInfo, recruitInfo } = this.props;

        return (
            <div className="sub-contents">
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
                        <div className="sub_heading_text">회사에 지원한 지원자들을 확인하세요</div>
                        <br />
                    </div>
                    <div className="clear"></div>
                    <div className="sub_box">
                        <div className="apply_step4">
                            <div className="apply_step4_list">
                                <div className="apply_step4_table_title">공고명 : {recruitInfo.noticeName}</div>
                                <div className="apply_step4_table_title">{companyBasicInfo.companyName} (지원자: {applyList.length}명)<span>※ 최종제출을 완료한 지원자들의 목록입니다</span></div>
                                <div className="line_2_gray"></div>
                                <div className="gt-f-r margin_top_10">
                                    <div className="">
                                        <div className="">
                                            <button className="selectric_search_button_100px" style={{marginLeft: "5px"}} onClick={clickFilter}><span>{filtering ? "필터숨기기":"필터보이기"}</span></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="gt-f-l width_100p margin_top_10">
                                    <ApplyListTable 
                                        selectChange={renderEditableSelect} 
                                        applyList={applyList} 
                                        clickApplyDetail={clickApplyDetail}
                                        clickApplyDownload={clickApplyDownload}
                                        filtering={filtering}
                                    />
                                </div>
                                </div>
                            </div>
                    </div>

                    <div className="page_btn_area_agreement">
                        <div className="page_btn_box">
                        <a className="btn_full_save gt-f-l margin_right_20" onClick={handleBack}>뒤로가기</a>
                        <a className="btn_full_next gt-f-l" onClick={clickSave}>저장</a>
                        <div className="clear"></div>
                        </div>
                    </div>
                    </div>
                </div>
          );
    }
}
 

export default connect(
    (state) => ({
        applyList: state.apply.get('applyList'),
        companyBasicInfo: state.company.get("companyBasicInfo"),
        companyId : state.company.get("companyId"),
        serialNumber: state.apply.get("serialNumber"),
        recruitInfo : state.recruit.get("recruitInfo")
    }), (dispatch) => ({
        ApplyActions : bindActionCreators(applyActions, dispatch),
        CompanyActions : bindActionCreators(companyActions, dispatch),
        MenuActions : bindActionCreators(menuActions, dispatch),
        AuthActions : bindActionCreators(authActions, dispatch),
    })
)(ApplyListContainer);

