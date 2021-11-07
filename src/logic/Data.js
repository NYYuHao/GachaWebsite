// Might want to make this connect to a database
// For now, just use localStorage
var collection = localStorage.collection ?
    new Set(JSON.parse(localStorage.collection)) : new Set();

// Generate array of random character IDs for RollPage keeping track of what
// has been rolled
// Seems like 229946 is the highest ID offered by Anilist
// Some IDs seem to be missing (e.g. 8, 9, 10)
function generateCharacterIds() {
    console.log("Generating characters");
    let idArray = [];
    while (idArray.length < 15) {
        let id = Math.floor(Math.random() * 229946);
        if (!collection.has(id))
            idArray.push(id)
    }
    return idArray;
}


// Get the characters IDs that have already been collected
function getCollectedCharacterIds() {
    console.log("Getting collected characters");
    return Array.from(collection);
}

// Add the given id to the user's collection (stored in localStorage)
function addCharacterToCollection(id) {
    console.log("Adding character to collection");

    if (!collection.has(id)) {
        collection.add(id);
    }
}

// Remove the given id from the user's collection
function removeCharacterFromCollection(id) {
    console.log("Removing character from collection");

    collection.delete(id);
}

// Format an Anilist character into an object for direct use
function anilistToCharacter(anilistChar) {
    return {
        id: anilistChar.id,
        name: anilistChar.name.full,
        media: anilistChar.media.nodes[0] ?
            anilistChar.media.nodes[0].title.romaji : null,
        mediaId: anilistChar.media.nodes[0] ?
            anilistChar.media.nodes[0].id : null,
        value: anilistChar.favourites,
        image: anilistChar.image.large
    };
}

// Format an Anilist media into an object for direct use
function anilistToMedia(anilistMedia) {
    console.log(anilistMedia);
    let startDate = new Date(Date.UTC(
        anilistMedia.startDate.year, anilistMedia.startDate.month-1, anilistMedia.startDate.day+1
    )).toLocaleDateString();
    let endDate = new Date(Date.UTC(
        anilistMedia.endDate.year, anilistMedia.endDate.month-1, anilistMedia.endDate.day+1
    )).toLocaleDateString();

    // TODO: Fill this out with usable information
    return {
        id: anilistMedia.id,
        image: anilistMedia.coverImage.large,
        title: anilistMedia.title.romaji,
        startDate: startDate,
        endDate: endDate
    }
}

// Save collection to localstorage, to be called on page exit or at intervals
function saveDataToStorage() {
    localStorage.collection = JSON.stringify([...collection]);
}

export {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, removeCharacterFromCollection,
    anilistToCharacter, anilistToMedia, saveDataToStorage};
