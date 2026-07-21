import AnimeList from "./AnimeList"
import SeriesList from "./SeriesList"
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
                    <MediaList token={props.token} />
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
                    <MediaList token={props.token} />
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
                    <NovelList token={props.token} />
                </div>
                <div>
                    Trending Variable
                </div>
            </div>
        </>)
}
function Series(props: Mediaprops) {
    return (
        <>
            <div>
                <h2>Series Component</h2>
                <button>Add Variable</button>
                <div>
                    Latest Updates
                </div>
                <div>
                    Trending Variable
                </div>
                <div>
                    <SeriesList token={props.token} />
                </div>
            </div>
        </>)
}

export { Anime, Manga, Novel, Series };