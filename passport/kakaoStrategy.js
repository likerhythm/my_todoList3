const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new kakaoStrategy(
    // 카카오 로그인에 대한 설정
    {
        // 카카오에서 발급해주는 아이디
        // 노출되면 안되므로 process.env.KAKAO_ID로 설정
        clientID: process.env.KAKAO_ID,
        // 카카오로부터 인증결과를 받을 라우터
        callbackURL: '/auth/kakao/callback',
    }, 
    // 카카오는 인증 후 위의 callbackURL에 적힌 주소로 accessToken, refreshToken, profile을 보냄
    async (accessToken, refreshToken, profile, done) => {
        // profile은 카카오에서 보내주는 사용자 정보, 콘솔로 확인해보는 것이 좋음
        console.log('kakao profile', profile);
        try {
            // 회원이 존재하는지 확인
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao'},
            });
            // 회원이 존재할 때 done 함수 호출 후 전략 종료
            if (exUser) {
                done(null, exUser);
            } 
            // 회원이 존재하지 않을 때
            else {
                // profile에서 원하는 객체를 꺼내와서 사용자 생성 후 done 함수 호출
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
