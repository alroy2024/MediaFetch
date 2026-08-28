export default async function useAddtoList(
    id: number,
    english: string,
    romaji: string,
    image: string,
    token: string,
    type: "ANIME" | "MANGA",
    currentChapter: number,
    totalChapter: number,
    status: string,
    favorite: boolean,
) {
    await fetch('http://localhost:8080/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id,
                english: english,
                romaji: romaji,
                image: image,
                type: type,
                currentChapter: currentChapter,
                totalChapter: totalChapter,
                status: status,
                favorite: favorite,
            })
        }
    )
}