import {
  MyApplyContainer,
  QuestionAddContainer,
  CompanyContainer,
  CompanyInfoContainer,
  IntroContainer,
  LoginContainer,
  FaqContainer,
  RegisterContainer,
  MyPasswordContainer,
  NoticeContainer,
  RecruitApplyContainer,
  RecruitCompanyContainer,
  ApplyListContainer ,

  CompletedContainer
} from 'containers';
        
import { RegistForm } from 'components';


export const privateRoutes = [

  { /** 마이페이지 */
    path: "/mypage",
    component: MyApplyContainer
  },
  { /** 비밀번호변경 */
    path: "/mypass",
    component: MyPasswordContainer
  },
  { /** 등록공고조회 */
    path: "/recruitlist",
    component: RecruitApplyContainer
  },
  { /** 지원자조회 */
    path: "/applylist",
    component: ApplyListContainer
  },
  { /** 지원자조회(상세) */
    path: "/applydetail",
    component: RegistForm
  },
  { /**공고등록관리 */
    path: "/recruit/recruitcompany",
    component: RecruitCompanyContainer
  },
  { /** 회사정보관리*/
    path: "/companyinfo",
    component: CompanyInfoContainer
  },
  {/** 행복성장캠퍼스 소식(공지사항) 페이지 */
    path: "/intro/notice",
    component: NoticeContainer
  },
  
];

export const publicRoutes = [

  {/** 로그인 */
    path: "/login",
    component: LoginContainer
  },
  {/** 회원가입 */
    path: "/register",
    component: RegisterContainer
  },
  {/** 소개페이지 */
    path: "/intro/main",
    component: IntroContainer
  },
  {/** 소개페이지 */
    path: "/intro/programs",
    component: IntroContainer
  },
  {/** 소개페이지 */
    path: "/intro/process",
    component: IntroContainer
  },
  {/** 소개페이지 */
    path: "/intro/curriculum",
    component: IntroContainer
  },
  {/** 소개페이지 */
    path: "/intro/benefit",
    component: IntroContainer
  },
  {/** 채용희망사 소개 */
    path: "/recruit/company",
    component: CompanyContainer
  },
  {/** 가입요청 완료 페이지 */
    path: "/request",
    component: CompletedContainer
  },
];