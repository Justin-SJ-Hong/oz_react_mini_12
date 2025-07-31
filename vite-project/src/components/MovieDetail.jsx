// import detailData from '../../data/movieDetailData.json' 
import '../styles/MovieDetail.css'

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function MovieDetail() {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const { id } = useParams(); // URL에서 id 가져오기
    console.log('id : ', id)
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
        };

        fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setMovie(data);
        })
        .catch(err => console.error(err));
    }, [id]);

    console.log('movie : ', movie)

    if (!movie || movie.success === false) return <p>로딩 중 또는 에러</p>;
    return (
        <>
            <div className='movieDetail'>
                <div className='detailPoster'>
                    {/* <img src={`${baseUrl}${detailData.belongs_to_collection.poster_path}`} /> */}
                    <img src={`${baseUrl}${movie.poster_path}`} />
                </div>
                <div className='detailContent'>
                    <div className='detailTitleRating'>
                        <div className='detailTitle'>
                            {/* <h3>{detailData.title}</h3> */}
                            <h3>{movie.title}</h3>
                        </div>
                        <div className='detailRate'>
                            {/* <h3>{detailData.vote_average}</h3> */}
                            <h3>{movie.vote_average}</h3>
                        </div>
                    </div>
                    <div className='detailGenres'>
                        {/* {detailData.genres.map((el) => <span key={el.id}>&nbsp; {el.name} &nbsp;</span>)} */}
                        {movie.genres.map((el) => <span key={el.id}>&nbsp; {el.name} &nbsp;</span>)}
                    </div>
                    <div className='detailOverview'>
                        {/* <p>{detailData.overview}</p> */}
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </>
    )
}