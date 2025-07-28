import './App.css'
import MovieCard from './components/MovieCard'
// import data from  '../data/movieListData.json'
import MovieDetail from './components/MovieDetail'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useEffect, useState } from 'react'

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
      }
    };

    fetch('https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR', options)
      .then(res => res.json())
      .then(data => {
        console.log(data.results);
        const filtered = data.results.filter(movie => movie.adult === false)
        // setList(data.results);
        setList(filtered)
      })
      .catch(err => console.error(err));
  }, [])

  // console.log(list)

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route 
            index
            element={
              <div className='movieList'>
                {/* {data.results.map((el) => (<MovieCard key={el.id} data={el} />))} */}
                {list.map((el) => (<MovieCard key={el.id} data={el} />))}
              </div>
            }
          />
          {/* <Route path='/details' element={<MovieDetail />} /> */}
          <Route path='details/:id' element={<MovieDetail />} />
        </Route>
        
      </Routes>
    </>
  )
}

export default App
