// Might want to make this connect to a database
// For now, just use localStorage

// Generate array of random character IDs for RollPage keeping track of what
// has been rolled
// Seems like 229946 is the highest ID offered by Anilist
// Some IDs seem to be missing (e.g. 8, 9, 10)
function generateCharacterIds() {
    console.log("Generating characters");
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}


// Get the characters IDs that have already been collected
function getCollectedCharacterIds() {
    console.log("Getting collected characters");
    return [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
}

export {generateCharacterIds, getCollectedCharacterIds};