import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 검색어 바뀌면 리스트, 페이지 초기화
  useEffect(() => {
    setList([]);
    setPageNum(1);
    setHasMore(true);
  }, [query]);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore) return;

      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      };

      const url = query.trim()
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=${pageNum}&include_adult=true`
        : `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${pageNum}`;

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        const newItems = (data.results || []).filter(
          (movie) => movie.adult === false && movie.poster_path !== null
        );

        // 중복 제거
        setList((prev) => {
          const uniqueItems = newItems.filter((item) => !prev.some((p) => p.id === item.id));
          return [...prev, ...uniqueItems];
        });

        // 다음 페이지 없으면 더 이상 불러오지 않음
        if (data.page >= data.total_pages) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('❌ Error fetching movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, pageNum]);

  // 무한스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !isLoading &&
        hasMore
      ) {
        setPageNum((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  return (
    <>
      <div className="movieList">
        {list.map((el) => (
          <MovieCard key={el.id} data={el} />
        ))}

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`loading-${i}`} className="skeleton-card" />
          ))}
      </div>

      {!hasMore && (
        <div className="end-message">📦 더 이상 데이터가 없습니다.</div>
      )}
    </>
  );
}
