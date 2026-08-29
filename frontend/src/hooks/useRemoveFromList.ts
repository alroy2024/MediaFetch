import { API_BASE_URL } from '../config';

export default function useRemoveFromList() {
    const removeMedia = async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/remove`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Media remove request failed: ${response.status}`);
        }
    }
    return removeMedia;
}