import React, {Component} from 'react';
import dateTimeFormat from 'lib/dateTimeFormat';/** 날짜 포맷 변경 공통함수 */

const MyQuestionPopup = ({questionInfo, onClose}) => {

    return (
        <div className="popup_wrap">
            <div className="popup_area">
                {/* <!-- 팝업 헤더 시작 --> */}
                <div className="popup_header">
                    <div className="popup_title gt-f-l">나의 문의내용</div>
                    <div className="popup_close" onClick={onClose}></div>
                    <div className="clear"></div>
                </div>
                {/* <!-- 팝업 헤더 끝 --> */}
                {/* <!-- 팝업 컨텐츠 시작 --> */}
                <div className="popup_contents">
                    <br />
                    <div className="popup_contents_text">
                            <table className="mypage_table_contents">
                                <colgroup>
                                    <col width="100px"/>
                                    <col width="650px"/>
                                </colgroup>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <th>카테고리</th>
                                        <td><input className="text_inp_disable_88pc" readOnly value={questionInfo.questionType} /></td>
                                    </tr>
                                    <tr>
                                        <th>제목</th>
                                        <td><input className="text_inp_disable_88pc" readOnly value={questionInfo.questionTitle} /></td>
                                    </tr>
                                    <tr>
                                        <th>문의일시</th>
                                        <td><input className="text_inp_disable_88pc"readOnly value={dateTimeFormat(questionInfo.createDatetime)} /></td>
                                    </tr>
                                    <tr>
                                        <th>문의내용</th>
                                        <td><textarea className="textarea_disable_95" readOnly value={questionInfo.questionContent}/></td>
                                    </tr>
                                    <tr>
                                        <th>상태</th>
                                        <td><input className="text_inp_disable_88pc" readOnly value={questionInfo.answerYn === "예"? "답변완료" : "문의중" } /></td>
                                    </tr>
                                    <tr>
                                        <th>답변내용</th>
                                        <td><textarea className="textarea_disable_95" readOnly value={questionInfo.questionAnswer===null? "": questionInfo.questionAnswer}/></td>
                                    </tr>
                                </tbody>
                            </table>
                       
                    </div>
                </div>
                {/* <!-- 팝업 컨텐츠 끝 --> */}
            </div>
        </div>
    );
}

export default MyQuestionPopup;
