import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchMovies,
  type FetchMoviesResponse,
} from "../../services/movieService";

import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error, isSuccess, isFetching } =
    useQuery<FetchMoviesResponse>({
      queryKey: ["movies", searchQuery, currentPage],
      queryFn: () => fetchMovies(searchQuery!, currentPage),
      enabled: !!searchQuery,
      retry: false,
      placeholderData: keepPreviousData,
    });

  const hasResults = data?.results && data.results.length > 0;

  useEffect(() => {
    if (data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader loading />}

      {isError && <ErrorMessage message={(error as Error).message} />}

      {isSuccess && hasResults && (
        <MovieGrid movies={data!.results} onSelect={handleSelectMovie} />
      )}

      {isFetching && !isLoading && <Loader loading />}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      {hasResults && (
        <ReactPaginate
          pageCount={data!.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <ScrollToTopButton />
    </div>
  );
}
