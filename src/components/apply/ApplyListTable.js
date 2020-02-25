import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { dateBarFormat } from 'lib/dateFormat'

import iconDownload from 'public/assets/img/icon_btn_down.png';
import iconDetail from 'public/assets/img/icon_btn_search.png';

const ApplyListTable = ({applyList, selectChange, clickApplyDetail, clickApplyDownload, filtering}) => {

    const headerClass =  {
        // "height":"40px",
        "backgroundColor":"#999999",
        "color":"#FFFFFF",
        "fontSize": '14px',
        "fontFamily" : ['Malgun Gothic','맑은 고딕','돋움', 'dotum', `sans-serif`]
    }

    const textCenter = {
        "textAlign":"center"
    }

    const clickDetail = (row) => {
        clickApplyDetail(row)
    }

    const clickDownload = (row) => {
        clickApplyDownload(row)
    }

    return (

        <ReactTable
            columns={[
                // { Header:"No",  accessor:"no", style: textCenter, headerStyle:headerClass,  width:65,  },
                { Header:"지원자명", accessor:"applyName", style: textCenter, headerStyle:headerClass, width: 95,  },
                { Header:"우선순위", accessor:"priority", style:textCenter, headerStyle:headerClass, width: 100 },
                { Header:"생년월일", accessor:"applyBirth", style: textCenter, headerStyle:headerClass, width: 115,
                    Cell: (row) => (
                        <span>{dateBarFormat(row.value)}</span>
                    )},
                { Header:"최종학력", accessor:"applySchool",  width: 140,  style: textCenter,  headerStyle:headerClass },
                { Header:"서류결과", accessor:"documentStatus", Cell: selectChange, headerStyle:headerClass, width: 110 },
                { Header:"면접결과", accessor:"interviewStatus", Cell: selectChange, headerStyle:headerClass, width: 110 },
                { Header:"최종결과", accessor:"finalStatus", Cell: selectChange, headerStyle:headerClass, width: 110 },
                { Header:"변경", accessor:"changeYn", width: 54, style:{ "textAlign":"center", "color":"red", "fontWeight":"bold", "fontSize":"10pt" }, headerStyle:headerClass },
                { Header:"상세보기", accessor:"", width: 90,  headerStyle:headerClass,
                    Cell: (row) => (
                        <a className="btn_table_Grid_gray" onClick={ () => clickDetail(row) }>상세<span className="margin_left_5"><img src={iconDetail}/></span></a>
                    )
                },
                { Header:"docx저장", accessor:"", width: 90, headerStyle:headerClass,
                    Cell: (row) => (
                        <a className="btn_table_Grid_gray" onClick={ () => clickDownload(row) }>저장<span className="margin_left_5"><img src={iconDownload}/></span></a>
                    ) 
                },

                ]}
            data={applyList}
            defaultPageSize={10}
            className="-highlight react_table" //-striped 
            filterable={filtering}
        ></ReactTable>
       
    )

}

export default ApplyListTable;