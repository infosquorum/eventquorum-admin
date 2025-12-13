import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getPosts() {
  try {
    const res = await axios.get(endpoints.post.list);
    return res.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Retourner une structure par défaut pour éviter le crash
    return { posts: [] };
  }
}

// ----------------------------------------------------------------------

export async function getPost(title: string) {
  try {
    const URL = title ? `${endpoints.post.details}?title=${title}` : '';
    
    if (!URL) {
      throw new Error('Title is required');
    }
    
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return { post: null };
  }
}

// ----------------------------------------------------------------------

export async function getLatestPosts(title: string) {
  try {
    const URL = title ? `${endpoints.post.latest}?title=${title}` : '';
    
    if (!URL) {
      throw new Error('Title is required');
    }
    
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return { posts: [] };
  }
}