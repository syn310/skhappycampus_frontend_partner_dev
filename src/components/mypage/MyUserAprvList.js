import React, { Component } from 'react';

import ReactTable from "react-table";
import "react-table/react-table.css";
import dateTimeFormat from 'lib/dateTimeFormat'
import storage from 'lib/storage';
import iconCheck from 'public/assets/img/icon_btn_ok.png';

const MyUserAprvList = ({userList, approveClick}) => {

    const headerClass =  {
        "height":"40px",
        "fontWeight":"bold", 
        "paddingTop":"9px"
    }

    const textCenter = {
        "textAlign":"center"
    }

    const textCenterBold = {
        "textAlign":"center",
        "fontWeight":"bold"
    }

    const textLeft = {
        "textAlign":"left"
    }

    



    return (
        <div className="apply_step4">
            <div className="apply_step4_list">
                <div>
                    <div className="apply_step4_table_title">가입신청 현황<span>신규 가입신청 현황을 확인하세요</span></div>
                    <div>
                        <div className="line_2_gray"></div>
                        <ReactTable
                            columns={[
                                { Header:"아이디", accessor:"userId", style: textCenter, headerStyle:headerClass, },
                                { Header:"가입일시", accessor:"createDatetime", style:textCenter, headerStyle:headerClass,  width: 200,
                                    Cell: (rowInfo) => { 
                                        return <span>{dateTimeFormat(rowInfo.value)}</span>
                                    }
                                },
                                { Header:"가입승인", accessor:"aprvCompleteYn", style: textCenter, headerStyle:headerClass, width: 120,
                                    Cell: (rowInfo) => {
                                        return storage.getUserInfo()===rowInfo.row.userId ? <span></span> : (rowInfo.value==="Y" ? <span>승인완료</span> : 
                                        // <button style={{"cursor":"pointer","textAlign":"center"}} onClick={ () =>  approveClick(rowInfo) }>가입승인</button>
                                        // <div className="">
                                        <a className="btn_table_Grid_gray" onClick={()=>approveClick(rowInfo)}>가입승인<span className="margin_left_5"><img src={iconCheck}/></span></a>
                                        // </div>
                                        )
                                    }
                                },
                                { Header:"승인일시", accessor:"updateDatetime", style:textCenter, headerStyle:headerClass, width: 200,
                                    Cell: (rowInfo) => {
                                        return rowInfo.row.createDatetime==rowInfo.row.updateDatetime ? <span></span> : <span>{dateTimeFormat(rowInfo.value)}</span>
                                    }
                                },
                            ]}
                            data={userList}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        ></ReactTable>
                    </div>
                </div>
            </div>  
        </div>
    )

}

export default MyUserAprvList;