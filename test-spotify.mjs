async function test() {
    const res = await fetch('https://embed.spotify.com/?uri=https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy');
    const text = await res.text();
    const match = text.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
    if (match) {
        const json = JSON.parse(match[1]);
        const entity = json.props.pageProps.state.data.entity;
        console.log(entity.name);
    } else {
        console.log("No match");
    }
}
test();
