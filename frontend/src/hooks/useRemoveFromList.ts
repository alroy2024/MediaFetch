export default function useRemoveFromList() {
    const removeMedia = async (id: number, token: string) => {
        const response = await fetch('http://localhost:8080/remove',
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