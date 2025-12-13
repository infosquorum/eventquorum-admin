import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getProducts() {
  try {
    const res = await axios.get(endpoints.product.list);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Retourner une structure par défaut pour éviter le crash
    return { products: [] };
  }
}

// ----------------------------------------------------------------------

export async function getProduct(id: string) {
  try {
    const URL = id ? `${endpoints.product.details}?productId=${id}` : '';
    
    if (!URL) {
      throw new Error('Product ID is required');
    }
    
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return { product: null };
  }
}