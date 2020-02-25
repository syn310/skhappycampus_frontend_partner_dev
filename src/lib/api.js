import axios from  'axios';
import storage from 'lib/storage';
import devtest from 'lib/devtest';
import * as authActions from 'modules/auth';
import * as menuActions from 'modules/menu';

/** 특정 url만 interceptor 적용 */
// const axiosInstance = axios.create({
//     baseURL: devtest() +"/notice"
// })
// const axiosInstance = axios.create({
//     baseURL: `http://localhost:8888`,
//     //url: 'recruitNotice/tt'
// });

/** Axios Interceptor 적용 */
export const errorInterceptors = (store, history) => {
    axios.interceptors.response.use(function (response) {
        /** response data로 해야할 일*/
        return response;
    }, function (err) {
        /** response error로 해야할 일*/
        if(err.response.status==999){
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            history.push("/login");
        }else if(err.response.status==998){
            alert("로그인 시간이 만료되었습니다. 로그인 페이지로 이동합니다.");
            //sessionStorage에 userInfo key의 데이터 삭제
            storage.removeSessionObj();
            storage.removeSerialNumber();
            //store의 login데이터 reset
            store.dispatch(menuActions.setClickMenu('/login'));
            store.dispatch(authActions.logout());
            history.push("/login");
        }else if(err.response.status==401){
            let msg = "잘못된 로그인 정보입니다. 로그인 페이지로 이동합니다";

            if(err.response.data.error.indexOf("가입승인") > -1){
                msg = "아직 가입승인 전입니다.\n귀사 대표관리자의 가입승인 후 로그인할 수 있습니다."
            }
            else if(err.response.data.error.indexOf("ID 혹은 패스워드") > -1){
                msg = "ID 혹은 패스워드를 확인해주세요"
            }
            else {}
            alert(msg);
            //sessionStorage에 userInfo key의 데이터 삭제
            storage.removeSessionObj();
            storage.removeSerialNumber();
            //store의 login데이터 reset
            store.dispatch(menuActions.setClickMenu('/login'));
            store.dispatch(authActions.logout());
            history.push('/login');
        }else{
            alert("알수없는 에러가 발생했습니다. 시스템 담당자에게 문의하세요.")
            console.log( err.response);
        }
        
        return Promise.reject(err);
    });
}
