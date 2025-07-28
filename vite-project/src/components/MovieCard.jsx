import { Link } from 'react-router-dom';
import '../styles/MovieCard.css'

export default function MovieCard({data}) {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return (
        <>
            <Link to={`/details/${data.id}`}>
                <div className="card">
                    <div className="poster">
                        <img src={`${baseUrl}${data.backdrop_path}`} alt={`${data.title}`} />
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