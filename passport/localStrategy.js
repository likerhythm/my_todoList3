const passport = require('passport');
// passport-local 모듈에서 Strategy 생성자 가져오기
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy(
    // LocalStrategy 생성자의 첫번째 인수
    // Strategy에 관한 설정
    {
        // 일치하는 로그인 라우터의 req.body 속성명을 적으면 됨
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    },
    // LocalStrategy 생성자의 두번째 인수
    // Strategy 수행
    // email과 password 매개변수는 첫번째 인수에서 넣어준 email과 password 
    async (email, password, done) => {
        try {
            // exUser: 사용자 정보
            const exUser = await User.findOne({ where: { email } });
            // 사용자가 존재한다면 실행
            if (exUser) {
                // 비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password);
                // 비밀번호 일치
                if (result) {
                    // auth.js로 돌아감
                    done(null, exUser);
                // 비밀번호 불일치
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            // 사용자가 존재하지 않다면 실행
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다. '});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};