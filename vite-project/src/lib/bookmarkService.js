import { supabase } from "./supabaseClient";

// 북마크 추가
export async function addBookmark(userId, movie) {
  return await supabase.from('bookmarks').upsert({
    user_id: userId,
    movie_id: movie.id,
    movie_data: movie,
  }, { onConflict: 'user_id, movie_id' });
}

// 북마크 삭제
export async function removeBookmark(userId, movieId) {
  return await supabase.from('bookmarks')
    .delete()
    .match({ user_id: userId, movie_id: movieId });
}

// 북마크 목록 가져오기
export async function getBookmarks(userId) {
  return await supabase.from('bookmarks')
    .select('movie_id, movie_data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

// 북마크 여부 확인
export async function isBookmarked(userId, movieId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle(); // ← single() → maybeSingle()으로 변경

  if (error) {
    console.error('🔍 북마크 확인 에러:', error.message);
    return false;
  }

  return !!data;
}
