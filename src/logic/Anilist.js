const fetch = require('node-fetch');

function getCharacter(id) {
    let query = `
        query ($id: Int) {
            Character (id: $id) {
                name {
                    full
                }
                favourites
                image {
                    large
                }
            }
        }`;

    var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: {id: id}
        })
    };
  
    return fetch(url, options).then((res) => {return res.json()});
};

export {getCharacter};
