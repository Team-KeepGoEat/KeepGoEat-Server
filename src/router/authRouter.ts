import { Router } from "express";
import auth from "../auth/auth";

const router:Router = Router();

router.get("/refresh", auth.refresh);
router.post("/", auth.socialLogin);

// //* 네이버로 로그인하기 라우터
// router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

// //? 위에서 네이버 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 
// router.get(
//   '/naver/callback',
//   //? 그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
//   passport.authenticate('naver', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   },
// );

export default router;