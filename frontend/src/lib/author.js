const AUTHORS_KEY = 'yourblog_authors_map';

export function getSavedAuthors() {
  try {
    const raw = localStorage.getItem(AUTHORS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveAuthor(userId, authorName) {
  if (!userId || !authorName) return;
  try {
    const authors = getSavedAuthors();
    authors[userId] = authorName;
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
  } catch (e) {
    console.warn('Failed to save author to localStorage', e);
  }
}

export function resolveAuthorName(post, currentUserId, currentUserName) {
  if (!post) return 'Author';

  // 1. Direct authorName / author / userName on the post object
  const directName =
    post.authorName || post.author || post.userName || post.user_name || post.name;
  if (directName && typeof directName === 'string' && directName.trim()) {
    return directName.trim();
  }

  // 2. If the current logged-in user is the author
  if (post.userId && currentUserId && post.userId === currentUserId) {
    return currentUserName || 'You';
  }

  // 3. Check persistent authors map in localStorage
  if (post.userId) {
    const authors = getSavedAuthors();
    if (authors[post.userId]) {
      return authors[post.userId];
    }
  }

  return 'Author';
}

export function getAuthorInitials(name) {
  if (!name || typeof name !== 'string') return 'AU';
  const clean = name.trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}
