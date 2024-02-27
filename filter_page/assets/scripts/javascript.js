const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const hash = md5(`${'Valantis'}_${stamp}`);
const url = 'http://api.valantis.store:40000/';

function get_data(action, data_list) {
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify(action),
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': hash
        }
    });

    fetch(request)
        .then(response => response.json())
        .then(action => {
            var data = action.result;
            for (var id in data) {
                data_list.push(data[id])
            }
        })
        .catch(error => console.error(error));
}

const get_ids = {
    "action": "get_ids",
    "params": {
        "offset": 1,
        "limit": 10
    }
};

var ids = [];
get_data(get_ids, ids);
console.log(ids)

var get_items = {
    "action": "get_items",
    "params": {
        "ids": ids
    }
};

var items = [];
if (ids.length > 0) {
    get_data(get_items, items);
    console.log(items)
}

