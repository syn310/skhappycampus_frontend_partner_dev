import React from 'react';
import 'style/common.css';
import { Link, withRouter } from 'react-router-dom';
const path = require('path');
import { connect } from 'react-redux';
import * as menuActions from 'modules/menu';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import devtest from 'lib/devtest';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          menuData:[]
        };
    }

    componentDidMount = () => {
        const self = this;
        axios({
          url: devtest() + "/menu/quick",
          method:"get",
          headers: { Pragma: 'no-cache'}
        })
        .then( (res) => {
          if (res.data){
              //조회한 데이터 store에 셋팅
              this.setState({
                  menuData: res.data
              })
          }
        }).catch(
            (err) => {
            console.log(err);
        });

    }


  /** 화면 이동  */
  handleMoveTo = (e) => {
    const clickUrl =  e.currentTarget.getAttribute("data-url");
    this.props.MenuActions.setClickMenu(clickUrl);
    this.props.history.push(e.currentTarget.getAttribute("data-url"));
  }


  render(){
        const { handleMoveTo } = this;

        const generateQuickMenu = (menuData) => {
            const originData = menuData;
            let showData = _.filter(originData, function(obj) { return obj.mainShowYn==="Y"; });
            //console.log(showData)
            return showData.map(
                (obj,idx)=>{
                    return (
                        <li className= { idx == 0 ? "gt-f-l menu_box_apply_info" : idx == 1 ? "gt-f-l menu_box_recruit_info" : "gt-f-l menu_box_company_info" } 
                            key={obj.menuId} data-url={`${obj.url}${obj.subUrl||""}`} onClick={handleMoveTo} style={{ marginRight: (idx == 2 ? '':'40px') }}>
                            <div className="menu_box_text" >
                                <div className="menu_box_main_title">{obj.menuName}</div>
                                <div className="menu_box_sub_title" dangerouslySetInnerHTML={ {__html: obj.mainDescription}}></div>
                            </div>
                         </li> 
                    )
                }
            )
        }


        return (
          <div className="contents">
            <div className="swiper-container">
                <div className="main_title" style={{"height":"270px"}}></div>
                <div className="sub_title"></div>
                <p className="bnt_area" >
                    {/* <span className="main_btn" data-url="/intro/main" onClick={handleMoveTo}>행복성장캠퍼스 알아보기</span> */}
                </p>
                <div className="menu_area">
                    <div className="menu_box">
                        <ul>
                                {generateQuickMenu(this.state.menuData)}
                            {/* <li className="gt-f-l menu_box_company_info" data-url="/recruit/companyinfo" onClick={handleMoveTo} style={{marginRight: '40px'}}>
                                <div className="menu_box_text" >
                                    <div className="menu_box_main_title">회사정보관리</div>
                                    <div className="menu_box_sub_title">우리 회사의<br />정보를 관리하세요</div>
                                </div>
                            </li> 
                            <li className="gt-f-l menu_box_recruit_info" data-url="/recruit/recruitcompany" onClick={handleMoveTo} style={{marginRight: '40px'}}>
                                <div className="menu_box_text">
                                    <div className="menu_box_main_title">채용정보등록</div>
                                    <div className="menu_box_sub_title">채용정보를<br />등록하세요</div>
                                </div>
                            </li> 
                            <li className="gt-f-l menu_box_apply_info" data-url="/recruitlist" onClick={handleMoveTo}>
                                <div className="menu_box_text">
                                    <div className="menu_box_main_title">지원현황</div>
                                    <div className="menu_box_sub_title clear">지원자들을<br />만나보세요</div>
                                </div>
                            </li> */}
                            <li className="clear"></li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        );
    }
}

export default withRouter(connect(
    (state) => ({
        clickedMenu: state.menu.get('clickedMenu'),
    }), (dispatch) => ({
        MenuActions : bindActionCreators(menuActions, dispatch)
    })
  )(App));
