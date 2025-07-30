import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputComponent from "./InputComponent";
import { supabase } from "../lib/supabaseClient";
import '../styles/Login.css';
import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const setUser = useUserStore((state) => state.setUser); // Zustand 사용

  const onSubmit = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('로그인 실패: ' + error.message);
        return;
      }

      const user = data.user;
      const meta = user.user_metadata || {};
      const userInfo = {
        id: user.id,
        email: user.email,
        displayName: meta.displayName || meta.full_name || meta.name || '사용자',
        avatarUrl: meta.avatar_url || meta.picture || null,
      };

      // 전역 상태에 저장 (App.jsx에서 따로 session 감지하고 있어도 명시적 설정 가능)
      setUser(userInfo);

      // 리다이렉션
      navigate('/');
    } catch (err) {
      alert('예상치 못한 오류: ' + err.message);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'http://localhost:5173', // 실제 배포 주소로 변경 필요
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('소셜 로그인 오류:', err.message);
      setError(`소셜 로그인 오류: ${err.message}`);
    }
  };

  return (
    <div className="my-login">
      <div className="login-part">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputComponent
            label="이메일"
            name="email"
            type="email"
            register={register}
            errors={errors}
            rules={{
              required: '이메일은 필수입니다.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            }}
          />

          <InputComponent
            label="비밀번호"
            name="password"
            type="password"
            register={register}
            errors={errors}
            rules={{
              required: '비밀번호는 필수입니다.',
              minLength: {
                value: 8,
                message: '비밀번호는 최소 8자 이상이어야 합니다.',
              },
            }}
          />

          <button type="submit">로그인</button>
        </form>
      </div>

      <div className="social-login">
        <button onClick={() => handleOAuthLogin('google')}>구글 로그인</button>
        <button onClick={() => handleOAuthLogin('kakao')}>카카오 로그인</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="begin-part">
        <span>OZ무비가 처음이신가요? </span>
        <Link to='/signup'>간편 가입</Link>
      </div>
    </div>
  );
}
