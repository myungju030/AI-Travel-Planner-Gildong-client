import { useEffect } from 'react';
import gildong from '@/assets/gildong_3d.png';
import kakao from '@/assets/kakao.png';
import { JAVASCRIPT_KEY, REDIRECT_URL } from '@/constants/auth';
import useStatus from '@/hooks/useStatus';
import styles from './styles.module.scss';

export default function SignIn() {
  useStatus('signIn', '');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js';
    script.integrity =
      'sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH';
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => {
      window.Kakao.init(JAVASCRIPT_KEY);
    };
    document.body.appendChild(script);
  }, []);

  const loginWithKakao = () => {
    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URL,
      scope: 'talk_calendar,profile_nickname,profile_image',
    }).then((error: any) => console.log(error.json()));
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <title className={styles.titleWrapper}>
          <img src={gildong} className={styles.img} alt="길동이이미지" />
          <span className={styles.description}>
            대화로 만들어가는 여행 플래너
          </span>
          <span className={styles.text}>AI Travel Planner</span>
          <span className={styles.title}>길동이</span>
        </title>
        <button className={styles.btnWrapper} onClick={loginWithKakao}>
          <div className={styles.btn}>
            <img src={kakao} alt="카카오로고이미지" />
            <span>카카오 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
}