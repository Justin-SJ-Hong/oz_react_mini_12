import { useUserStore } from '../store/userStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPage.css'; // 스타일링 파일
import { supabase } from '../lib/supabaseClient';
import AvatarUpload from './AvatarUpload';
// import { getBookmarks } from '../lib/bookmarkService';
import MovieCard from './MovieCard';
import { useState, useEffect } from 'react';

export default function MyPage() {
    const { bookmarks, fetchBookmarks, loading } = useBookmarkStore();
    const user = useUserStore((state) => state.user);
    const clearUser = useUserStore((state) => state.clearUser);
    const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);
    // const [bookmarks, setBookmarks] = useState([]);
    // const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

  const handleAvatarUpload = async (publicUrl) => {
    try {
        const {
            data: {user},
            error: userError,
        } = await supabase.auth.getUser();

        if(userError || !user) throw new Error('로그인된 사용자를 찾을 수 없습니다');

        const {error: updateError} = await supabase.auth.updateUser({
            data: {
                avatar_url: publicUrl,
            }
        });

        if(updateError) throw updateError;

        alert('아바타가 성공적으로 변경되었습니다!!');
        window.location.reload(); // ✅ 업로드 후 페이지 리로드
    } catch(err) {
        console.error('아바타 업데이트 실패: ', err.message);
        alert('아바타 업데이트 중 오류가 발생했습니다.');
    }
  };

    if (!user) {
        // 👇 명시적 리디렉션
        useEffect(() => {
            navigate('/', {replace: true});
        }, [user]);
        return null;
    }


    useEffect(() => {
        if (user) {
            fetchBookmarks(user.id);
        }
    }, [user]);

    // const deleteUser = async (userId, accessToken) => {
    //     const res = await fetch('https://xzxryrrzmzfmuaajlhld.supabase.co/functions/v1/delete-user', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${accessToken}`, // access token 필요하면 포함
    //         },
    //         body: JSON.stringify({ userId }),
    //     });

    //     const data = await res.json();

    //     if(!res.ok) {
    //         throw new Error(data.message || '회원 탈퇴 실패');
    //     }

    //     return data.message;
    // }

    const handleDelete = async () => {
        try {
            // const {
            //     data: { session },
            // } = await supabase.auth.getSession();

            const { data: sessionData } = await supabase.auth.getSession();
            const session = sessionData?.session;
            const userId = session?.user?.id;
            const accessToken = session?.access_token;
            const provider = session?.user?.app_metadata?.provider;
            const providerToken = session?.provider_token;

            if (!userId) {
                alert('로그인이 필요합니다.');
                return;
            }

            // 🔒 1. OAuth 토큰 무효화
            if (provider === 'google' && providerToken) {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${providerToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                });
                console.log('✅ 구글 토큰 해제됨');
            }

            if (provider === 'kakao' && providerToken) {
                await fetch('https://kapi.kakao.com/v1/user/unlink', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${providerToken}`
                    }
                });
                console.log('✅ 카카오 토큰 해제됨');
            }

            const res = await fetch('https://xzxryrrzmzfmuaajlhld.supabase.co/functions/v1/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${session.access_token}`, // X 사용 안 해도 됨 (if needed)
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ userId }),
            })

            // ✅ 소셜 access token revoke 요청
            // if (provider && oauthToken) {
            //     await fetch('https://xzxryrrzmzfmuaajlhld.supabase.co/functions/v1/delete-user', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ token: oauthToken, provider }),
            //     });
            // }

            // await deleteUser(userId, accessToken);

            // if (!res.ok) {
            //     const { message } = await res.json();
            //     alert(`탈퇴 실패: ${message}`);
            //     return;
            // }
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || '회원 탈퇴 실패');

            // 로그아웃 처리
            await supabase.auth.signOut();
            clearUser();
            clearBookmarks();
            window.location.href = '/';
            alert('회원 탈퇴가 완료되었습니다.');
        } catch (err) {
            console.error('탈퇴 오류:', err);
            alert(err.message);
        }
    };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="profile">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt="프로필 이미지"
          className="profile-avatar"
        />
        <div className="profile-info">
          <p><strong>이름:</strong> {user.displayName}</p>
          <p><strong>이메일:</strong> {user.email}</p>
        </div>
        <div>
            <AvatarUpload onUploaded={handleAvatarUpload} />
            <button onClick={handleDelete}>회원탈퇴</button>
        </div>
      </div>

      {/* 향후 추가 영역 */}
        <div className="mypage-content">
            <h2>내가 찜한 영화 목록</h2>
            {/* <ul>
            <li>리뷰 내역</li>
            <li>찜한 영화</li>
            <li>설정</li>
            </ul> */}
            {loading ? (
                <p>로딩 중...</p>
            ) : bookmarks.length === 0 ? (
                <p>북마크한 영화가 없습니다.</p>
            ) : (
                <div className="movieList">
                {bookmarks.map((movie) => (
                    <MovieCard key={movie.id} data={movie} />
                ))}
                </div>
            )}
        </div>
    </div>
  );
}
