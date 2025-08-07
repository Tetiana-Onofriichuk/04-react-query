import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";
import { getImageUrl } from "../../services/movieService";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  const filteredMovies = movies.filter(
    (movie) =>
      typeof movie.poster_path === "string" && movie.poster_path.trim() !== ""
  );

  if (filteredMovies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {filteredMovies.map((movie) => {
        const imageUrl = getImageUrl(movie.poster_path);
        return (
          <li key={movie.id}>
            <div className={css.card} onClick={() => onSelect(movie)}>
              <img
                className={css.image}
                src={imageUrl ?? undefined}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
