import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import defaultAvatar from '../assets/default.png';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../store/userStore';

export default function NavBar() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState(null);
  const [click, setClick] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 1000); // 0.5초 디바운스
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  // const [_, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (debouncedValue.trim()) {
  //     setSearchParams({ query: debouncedValue });
  //     navigate('/');
  //   } else {
  //     setSearchParams({});
  //   }
  // }, [debouncedValue, setSearchParams, navigate]);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //     setIsLoggedIn(true);
  //   } else {
  //     setUser(null);
  //     setIsLoggedIn(false);
  //   }
  // }, []);



  // 로그인 정보 불러오기
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  const handleClick = () => setClick(prev => !prev);

  // 로그아웃 처리
  const handleLogout = async () => {
    // await supabase.auth.signOut(); // 🔥 인증 세션도 종료
    // clearUser();
    // localStorage.removeItem('user');
    // navigate('/');
    // window.location.reload();
    const { clearUser } = useUserStore.getState();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. 로그인 제공자 자동 감지
    const provider = user?.app_metadata?.provider || 'email';

    // 2. Supabase 로그아웃
    await supabase.auth.signOut();
    clearUser();
    localStorage.removeItem('user');

    const origin = window.location.origin;

    // 3. 소셜 로그아웃 URL로 리디렉션
    if (provider === 'google') {
      const googleLogout = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${origin}`;
      window.location.href = googleLogout;
    } else if (provider === 'kakao') {
      const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY; // 🔁 여기에 본인의 키 넣기
      const kakaoLogout = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${origin}`;
      window.location.href = kakaoLogout;
    } else {
      // 일반 이메일 로그인은 그냥 홈으로 리디렉션
      navigate('/');
      window.location.reload();
    }
  };

  useEffect(() => {
    if(location.pathname === '/') {
      if (debouncedValue.trim()) {
        navigate(`/?query=${encodeURIComponent(debouncedValue)}`);
      } else {
        navigate(`/`);
      }
    }
  }, [debouncedValue, location.pathname, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">🎬 OZ무비</Link>
      </div>
      <div className="search">
        <input 
          type="text" 
          placeholder="영화 검색..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <nav>
        <div className='is-login'>
          {user
            ? `환영합니다, ${user.displayName || user.email}`
            : '로그인하지 않았습니다.'}
        </div>
      </nav>
      <div className="actions">
        <button className='darkButton' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <div className="profile-section">
            {/* <img
              src={user.avatarUrl || defaultAvatar}
              alt="avatar"
              className="avatar"
              onClick={handleLogout}
              title="클릭 시 로그아웃"
            /> */}
            <img
              src={user.avatarUrl || defaultAvatar}
              alt="avatar"
              className="avatar"
              onClick={handleClick}
              title="클릭 시 메뉴열기"
            />
            {click && (
              <ul className='profile-menu'>
                <li onClick={() => navigate('/mypage')}>마이페이지</li>
                <li onClick={handleLogout}>로그아웃</li>
              </ul>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login" onClick={() => navigate('/login')}>로그인</button>
            <button className="signup" onClick={() => navigate('/signup')}>회원가입</button>
          </div>
        )}
      </div>
    </header>
  );
}
