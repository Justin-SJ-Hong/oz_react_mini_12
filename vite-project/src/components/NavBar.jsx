import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/NavBar.css';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

export default function NavBar() {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 1000); // 0.5초 디바운스
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  // const [_, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (debouncedValue.trim()) {
  //     setSearchParams({ query: debouncedValue });
  //     navigate('/');
  //   } else {
  //     setSearchParams({});
  //   }
  // }, [debouncedValue, setSearchParams, navigate]);
  useEffect(() => {
    if (debouncedValue.trim()) {
      navigate(`/?query=${encodeURIComponent(debouncedValue)}`);
    } else {
      navigate(`/`);
    }
  }, [debouncedValue]);

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
      <div className="actions">
        <button className='darkButton' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="login">로그인</button>
        <button className="signup">회원가입</button>
      </div>
    </header>
  );
}
