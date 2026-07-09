export default async function useAddtoList(id: number,token: string) {
    await fetch('http://localhost:8080/remove',
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
    )
}