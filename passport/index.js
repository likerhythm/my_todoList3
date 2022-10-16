const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // user 정보 중 user.id만 세션에 저장
    passport.serializeUser((user, done) => {
        // done 호출 후 auth.js로 돌아감
        console.log('user: ', user);
        done(null, user.id);
    });

    // 로그인 후 매 요청마다 실행됨
    // app.js의 app.use(passport.session())에서
    // 세션에 있는 id를 deserializeUser로 넘겨 줌
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then(user => {done(null, user)})
        .catch(err => done(err));
    });

    local();
    // kakao();
};