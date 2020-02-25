import React, { Component } from 'react';
import dateTimeFormat from 'lib/dateTimeFormat';/** 날짜 포맷 변경 공통함수 */

const MyQuestion = ({myQuestionList, onPopup}) => {
    return (
        <div>
            <table className="apply_step4_table2_contents">
                <colgroup>
                    <col width="100px"/>
                    <col width="200px"/>
                    <col width="300px"/>
                    <col width="100px"/>
                    <col width="100px"/>
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">카테고리</th>
                        <th scope="row">제목</th>
                        <th scope="row">문의내용</th>
                        <th scope="row">상태</th>
                        <th scope="row">문의일시</th>
                    </tr>
                    {
                      myQuestionList.map((object, i) => {
                          return (
                            <tr key={i} data-questionseq={object.questionSeq} onClick={onPopup}>
                              <td>{object.questionType}</td>
                              <td>{object.questionTitle}</td>
                              <td>{object.questionContent}</td>
                              <td>{object.answerYn === "예"? "답변완료" : "문의중" }</td>
                              <td>{dateTimeFormat(object.createDatetime)}</td>
                            </tr>
                          );
                    })}
                </tbody>
            </table>
        </div>
    );

}

export default MyQuestion;
