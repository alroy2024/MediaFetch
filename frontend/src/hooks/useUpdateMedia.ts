import { API_BASE_URL } from '../config';

export default function useUpdateMedia() {
    return async (id: number, currentChapter: number, status: string, favorite: boolean, token: string) => {
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, currentChapter, status, favorite })
        });

        if (!response.ok) {
            throw new Error(`Media update request failed: ${response.status}`);
        }
    };
}
