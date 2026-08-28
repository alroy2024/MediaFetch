export default async function useAddNovel(
    id: number,
    title: string,
    image: string,
    token: string,
    currentChapter: number,
    totalChapter: number,
) {
    await fetch('http://localhost:8080/novels/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                title: title,
                image: image,
                currentChapter: currentChapter,
                totalChapter: totalChapter,
            })
        }
    )
}