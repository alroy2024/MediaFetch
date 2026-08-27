import AnimeList from "./AnimeList"
import MediaList from "./MediaList"
import NovelList from "./NovelList"
import MangaList from "./MangaList"

interface Mediaprops {
    token: string;
}

function Anime(props: Mediaprops) {
    return (
        <>
            <div>
                <div>
                    <MediaList token={props.token} listType="media" />
                </div>
                <div>
                    <AnimeList token={props.token} />
                </div>
            </div>
        </>)
}
function Manga(props: Mediaprops) {
    return (
        <>
            <div>
                <div>
                    <MediaList token={props.token} listType="media" />
                </div>
                <div>
                    <MangaList token={props.token} />
                </div>
            </div>
        </>)
}
function Novel(props: Mediaprops) {
    return (
        <>
            <div>
                <div>
                    <MediaList token={props.token} listType="novel" />
                </div>
                <div>
                    <NovelList token={props.token} />
                </div>
            </div>
        </>)
}

export { Anime, Manga, Novel };