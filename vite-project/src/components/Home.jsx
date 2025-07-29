import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/Home.css'

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // ✅ 시작
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      };

      console.log("🔍 Query:", query);
      
      try {
        const url = query.trim()
          ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&include_adult=true`
          : 'https://api.themoviedb.org/3/movie/popular?language=ko-KR';

        const res = await fetch(url, options);
        const data = await res.json();
        console.log("📦 Response:", data);

        const filtered = (data.results || []).filter(movie => movie.adult === false && movie.poster_path !== null);
        setList(filtered);
      } catch (err) {
        console.error("❌ Error fetching:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <>
      {isLoading && <div className="spinner">🔄 로딩 중...</div>}

      <div className="movieList">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))
          : list.map((el) => (
              <MovieCard key={el.id} data={el} />
            ))}
      </div>
    </>
  );
}
