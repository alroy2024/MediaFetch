import { API_BASE_URL } from '../config';

export default function useRemoveNovel() {
  return async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/novels/remove/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Novel remove request failed: ${response.status}`);
    }
  };
}