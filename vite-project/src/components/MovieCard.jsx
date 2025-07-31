import { Link } from 'react-router-dom';
import '../styles/MovieCard.css'
import { useUserStore } from '../store/userStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { addBookmark, removeBookmark, isBookmarked } from '../lib/bookmarkService';
import { useState, useEffect } from 'react';

export default function MovieCard({data}) {
    const user = useUserStore((state) => state.user);
    const { bookmarks, addBookmarkItem, removeBookmarkItem } = useBookmarkStore();
    const [bookmarked, setBookmarked] = useState(false);

    // useEffect(() => {
    //     const checkBookmark = async () => {
    //         if (user) {
    //             const exists = await isBookmarked(user.id, data.id);
    //             setBookmarked(exists);
    //         }
    //     };
    //     checkBookmark();
    // }, [user, data.id]);

    useEffect(() => {
        if (user) {
            setBookmarked(bookmarks.some((m) => m.id === data.id));
        }
    }, [bookmarks, data.id, user]);

    const handleBookmark = async () => {
        if (!user) {
            alert('로그인 후 이용 가능합니다.');
            return;
        }

        try {
            if (bookmarked) {
                await removeBookmarkItem(user.id, data.id);
            } else {
                await addBookmarkItem(user.id, data);
            }

            setBookmarked(!bookmarked);
        } catch (err) {
            console.error('북마크 처리 오류:', err);
        }
    };

    const baseUrl = import.meta.env.VITE_BASE_URL;
    return (
        <>
            <Link to={`/details/${data.id}`}>
                <div className="card">
                    <div className="poster">
                        <img src={`${baseUrl}${data.backdrop_path}`} alt={`${data.title}`} />
                        <button 
                            className='bookmark' 
                            onClick={(e) => {
                                e.preventDefault(); // 링크 이동 방지
                                e.stopPropagation(); // 이벤트 전파 방지
                                handleBookmark();
                                window.location.reload(); // ✅ 업로드 후 페이지 리로드
                            }}
                        >
                            {bookmarked ? '★' : '☆'}
                        </button>
                    </div>
                    <div className="title">
                        <h3>{data.title}</h3>
                    </div>
                    <div className="rated">
                        <h5>{data.vote_average}</h5>
                    </div>
                </div>
            </Link>
        </>
    )
}