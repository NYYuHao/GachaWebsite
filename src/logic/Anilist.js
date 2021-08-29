const fetch = require('node-fetch');

function getCharacterById(id) {
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

function getCharactersByIds(ids) {
    let query = `
        query ($id_in:[Int], $page:Int, $perPage:Int) {
	        Page(page:$page, perPage:$perPage) {
                pageInfo {
                    total
                    perPage
                    currentPage
                    lastPage
                    hasNextPage
                }
            characters (id_in:$id_in){
                name {
                    full
                }
                    favourites
                    image {
                        large
                    }
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
            variables: {id_in: ids, page: 1, perPage: 50}
        })
    };
  
    return fetch(url, options).then((res) => {return res.json()});
};

export {getCharacterById, getCharactersByIds};
