import { API_BASE_URL } from '../config';

export default async function useAddNovel(
    id: number,
    title: string,
    image: string,
    url: string,
    description: string,
    token: string,
    currentChapter: number,
    totalChapter: number,
    status: string,
    favorite: boolean,
) {
    await fetch(`${API_BASE_URL}/novels/add`,
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
                url: url,
                description: description,
                currentChapter: currentChapter,
                totalChapter: totalChapter,
                status: status,
                favorite: favorite,
            })
        }
    )
}