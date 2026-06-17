import AnimeList from "./AnimeList"
import SeriesList from "./SeriesList"

function Anime() {
    return (
        <>
            <div>
                <h2>Anime Component</h2>
                <button>Add Variable</button>
                <div>
                    Latest Updates
                </div>
                <div>
                    <AnimeList />               
                </div>
            </div>
        </>)
}
function Manga() {
    return (
        <>
            <div>
                <h2>Manga Component</h2>
                <button>Add Variable</button>
                <div>
                    Latest Updates
                </div>
                <div>
                    Trending Variable
                </div>
            </div>
        </>)
}
function Novel() {
    return (
        <>
            <div>
                <h2>Novel Component</h2>
                <button>Add Variable</button>
                <div>
                    Latest Updates
                </div>
                <div>
                    Trending Variable
                </div>
            </div>
        </>)
}
function Series() {
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
                    <SeriesList />               
                </div>
            </div>
        </>)
}

export { Anime, Manga, Novel, Series };