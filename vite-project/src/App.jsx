import './App.css'
// import MovieCard from './components/MovieCard'
// import data from  '../data/movieListData.json'
import MovieDetail from './components/MovieDetail'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
// import { useEffect, useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useUserStore } from './store/userStore'
import AuthCallback from './components/AuthCallback'
import MyPage from './components/MyPage'

function App() {
  // const [list, setList] = useState([]);

  // useEffect(() => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
  //     }
  //   };

  //   fetch('https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR', options)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data.results);
  //       const filtered = data.results.filter(movie => movie.adult === false)
  //       // setList(data.results);
  //       setList(filtered)
  //     })
  //     .catch(err => console.error(err));
  // }, [])

  // console.log(list)
  const location = useLocation(); // 추가
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const checkSupabaseSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ 세션 조회 에러:', error.message);
      return;
    }

    if (data?.session) {
      console.log('✅ 현재 Supabase 세션:', data.session);
      console.log('🪪 사용자 정보:', data.session.user);
      console.log('🔑 액세스 토큰:', data.session.access_token);
      console.log('🔄 리프레시 토큰:', data.session.refresh_token);
      console.log('🌍 공급자(provider):', data.session.user.app_metadata?.provider);
    } else {
      console.log('🕳️ 세션 없음 (로그아웃 상태)');
    }
  };

  useEffect(() => {
    checkSupabaseSession();
  }, []);

  useEffect(() => {
    const checkProviderToken = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('세션 오류:', error);
        return;
      }

      const provider = session?.user?.app_metadata?.provider;
      const token = session?.provider_token;

      console.log('🔍 OAuth Provider:', provider);
      console.log('🔐 Provider Token:', token);
    };

    checkProviderToken();
  }, []);



  useEffect(() => {
    // ✅ 최초 마운트 시, 새로고침 후에도 로그인 유지 확인
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const meta = user.user_metadata || {};
        const userInfo = {
          id: user.id,
          email: user.email,
          displayName: meta.full_name || meta.name || '사용자',
          avatarUrl: meta.avatar_url || meta.picture || null,
        };
        setUser(userInfo);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        const meta = user.user_metadata || {};
        const userInfo = {
          id: user.id,
          email: user.email,
          displayName: meta.full_name || meta.name || '사용자',
          avatarUrl: meta.avatar_url || meta.picture || null,
        };

        setUser(userInfo);
        if (location.pathname.startsWith('/login')) {
          window.location.replace('/');
        }
      }

      if (event === 'SIGNED_OUT') {
        clearUser();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  useEffect(() => {
    console.log('🔐 현재 로그인 상태:', user ? user : '로그인 안됨');
  }, [user]);

  return (
    <>
      <Routes>
        
        <Route path='/' element={<Layout />}>
          <Route 
            index
            // element={
            //   <div className='movieList'>
            //     {/* {data.results.map((el) => (<MovieCard key={el.id} data={el} />))} */}
            //     {list.map((el) => (<MovieCard key={el.id} data={el} />))}
            //   </div>
            // }
            element={<Home key={location.search}  />}
          />
          {/* <Route path='/details' element={<MovieDetail />} /> */}
          <Route path='details/:id' element={<MovieDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path='mypage' element={<MyPage />} />
          <Route path='auth/callback' element={<AuthCallback />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
