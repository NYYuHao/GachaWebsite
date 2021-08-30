// Might want to make this connect to a database
// For now, just use localStorage

// Generate array of random character IDs for RollPage keeping track of what
// has been rolled
function generateCharacters() {
    console.log("Generating characters");
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

export {generateCharacters};
