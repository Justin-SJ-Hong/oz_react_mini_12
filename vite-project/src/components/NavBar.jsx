import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <>
      <header className="navbar">
        <div className="logo">
          <Link to="/">🎬 OZ무비</Link>
        </div>
        <div className="search">
          <input type="text" placeholder="영화 검색..." />
        </div>
        <div className="actions">
          <button className="login">로그인</button>
          <button className="signup">회원가입</button>
        </div>
      </header>
    </>
  );
}
