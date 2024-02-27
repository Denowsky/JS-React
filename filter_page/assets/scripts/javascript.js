async function init() {
    await get_data(get_ids, ids);
    await get_data(get_brands, brands);
    await get_data(get_items, items);
    await append_options(brands)
    console.log(ids);
    console.log(brands);
    console.log(items);
}

async function get_data(action, data_list) {
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify(action),
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': hash
        }
    });

    try {
        const response = await fetch(request);
        const action = await response.json();
        const data = action.result;

        for (const id in data) {
            if (data[id] != null) {
                data_list.push(data[id]);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function append_options(options) {
    const brandFilter = document.getElementById('brand-filter');
    options.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
        console.log(brand);
    });
}

const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const hash = md5(`${'Valantis'}_${stamp}`);
const url = 'http://api.valantis.store:40000/';

var ids = [];
var get_ids = {
    "action": "get_ids",
    "params": {
        "offset": 1,
        "limit": 10
    }
};

var brands = [];
var get_brands = {
    "action": "get_fields",
    "params": {
        "field": "brand",
        "offset": 1,
        "limit": 10
    }
};

var items = [];
var get_items = {
    "action": "get_items",
    "params": { "ids": ids }
};

let currentPage = 1;
const productsPerPage = 50;

init()
