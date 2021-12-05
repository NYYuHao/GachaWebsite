// Might want to make this connect to a database
// For now, just use localStorage
var collectionData = localStorage.collection ?
    JSON.parse(localStorage.collection) : {};

// Generate array of random character IDs for RollPage keeping track of what
// has been rolled
// Seems like 229946 is the highest ID offered by Anilist
// Some IDs seem to be missing (e.g. 8, 9, 10)
function generateCharacterIds() {
    console.log("Generating characters");
    let idArray = [];
    while (idArray.length < 15) {
        let id = Math.floor(Math.random() * 229946);
        if (!collectionData.hasOwnProperty(id))
            idArray.push(id)
    }
    return idArray;
}


// Get the character IDs that have already been collected
function getCollectedCharacterIds() {
    console.log("Getting collected characters");
    return Object.keys(collectionData);
}

// Add the given id to the user's collection (stored in localStorage)
function addCharacterToCollection(id) {
    console.log("Adding character to collection");

    if (!collectionData.hasOwnProperty(id)) {
        collectionData[id] = {data: {dateObtained: new Date()}};
    }
}

// Remove the given id from the user's collection
function removeCharacterFromCollection(id) {
    console.log("Removing character from collection");

    delete collectionData[id];
}

// Format an Anilist character into an object for direct use
function anilistToCharacter(anilistChar) {
    // If the character was already obtained, provide the date
    let dateObtained = collectionData[anilistChar.id] ?
        collectionData[anilistChar.id].data.dateObtained : null;

    return {
        id: anilistChar.id,
        name: anilistChar.name.full,
        media: anilistChar.media.nodes[0] ?
            anilistChar.media.nodes[0].title.romaji : null,
        mediaId: anilistChar.media.nodes[0] ?
            anilistChar.media.nodes[0].id : null,
        value: anilistChar.favourites,
        image: anilistChar.image.large,
        dateObtained: dateObtained
    };
}

// Format an Anilist media into an object for direct use
function anilistToMedia(anilistMedia) {
    let startDate = new Date(Date.UTC(
        anilistMedia.startDate.year, anilistMedia.startDate.month-1, anilistMedia.startDate.day+1
    )).toLocaleDateString();
    let endDate = new Date(Date.UTC(
        anilistMedia.endDate.year, anilistMedia.endDate.month-1, anilistMedia.endDate.day+1
    )).toLocaleDateString();

    return {
        id: anilistMedia.id,
        image: anilistMedia.coverImage.large,
        title: anilistMedia.title.romaji,
        description: anilistMedia.description,
        type: anilistMedia.type,
        genres: anilistMedia.genres,
        averageScore: anilistMedia.averageScore,
        startDate: startDate,
        endDate: endDate,
        source: anilistMedia.source
    }
}

// Save collection to localstorage, to be called on page exit or at intervals
function saveDataToStorage() {
    localStorage.collection = JSON.stringify(collectionData);
}

export {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, removeCharacterFromCollection,
    anilistToCharacter, anilistToMedia, saveDataToStorage};
