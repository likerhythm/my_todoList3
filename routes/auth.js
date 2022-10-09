const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
console.log('This is auth!');
// 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            // join 주소 뒤에 에러를 쿼리 스트링으로 표현
            return res.redirect('/join?error=exist');
        }
        // 비밀번호 암호화
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        console.log('회원가입 완료');
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인 라우터
router.post('/login',isNotLoggedIn, (req, res, next) => {
    // 로컬 로그인 전략 수행
    // authenticate 매서드의 'local' 인수를 만나서
    // localStrategy.js로 이동
    passport.authenticate('local', 
    // localStrategy의 done 함수에서 받은 매개변수
    (authError, user, info) => {
        // 서버 에러
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        // 로그인 실패
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        // passport가 req 객체에 login 메서드 추가
        // req.login은 passport.serializeUser 호출
        // req.login에 제공하는 user객체가 serializeUser로 넘어감
        // serializeUser는 passport/index.js에 존재
        // passport/index.js로 이동
        return req.login(user, 
            // passport/index.js에서 받은 에러 변수가 있다면 실행
            (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            // 여기서 세션 쿠키를 브라우저로 전달
            // 로그인 성공
            console.log('로그인 성공');
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어는 (req, res, next)를 붙인다.
});

// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
    // req.logout은 req.user 객체를 제거
    req.logout();
    // req.session.destroy는 req.session 객체의 내용을 제거
    req.session.destroy();
    res.redirect('/');
});

// GET /auth/kakao로 접근하면 카카오 로그인 과정 시작
router.get('/kakao', passport.authenticate('kakao'));

// 처음 /auth/kakao에서 전략을 수행하면 카카오 로그인 창으로 리다이렉트 함
// 그 창에서 로그인 후 성공 여부 결과를 GET /auth/kakao/callback으로 받음
// 여기서 카카오 로그인 전략 다시 수행
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;