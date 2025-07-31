import { create } from 'zustand';
import { getBookmarks, addBookmark, removeBookmark } from '../lib/bookmarkService';

export const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  loading: false,

  fetchBookmarks: async (userId) => {
    set({ loading: true });
    const { data, error } = await getBookmarks(userId);
    if (error) {
      console.error('🔴 북마크 불러오기 실패:', error.message);
      set({ bookmarks: [], loading: false });
    } else {
      const movies = data.map(b => b.movie_data);
      set({ bookmarks: movies, loading: false });
    }
  },

  addBookmarkItem: async (userId, movie) => {
    const res = await addBookmark(userId, movie);
    if (!res.error) {
      set((state) => ({
        bookmarks: [movie, ...state.bookmarks],
      }));
    } else {
      console.error('🔴 북마크 추가 실패:', res.error.message);
    }
  },

  removeBookmarkItem: async (userId, movieId) => {
    const res = await removeBookmark(userId, movieId);
    if (!res.error) {
      set((state) => ({
        bookmarks: state.bookmarks.filter((m) => m.id !== movieId),
      }));
    } else {
      console.error('🔴 북마크 제거 실패:', res.error.message);
    }
  },

  clearBookmarks: () => set({ bookmarks: [] }),
}));
