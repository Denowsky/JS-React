async function getData(action) {
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
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function renderProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-list';
        li.innerHTML = `
        <div class="product-div prodict-id">${product.id}</div>
        <div class="product-div prodict-name">${product.product}</div>
        <div class="product-div prodict-brand">${product.brand}</div>
        <div class="product-div prodict-price">${product.price}</div>
      `;

        productsContainer.appendChild(li);
    });
}

function createIdObject(offset, limit) {
    const object = {
        "action": "get_ids",
        "params": { "offset": offset, "limit": limit }
    };
    return object;
}

function createItemObject(ids) {
    const items = {
        "action": "get_items",
        "params": { "ids": ids }
    };
    return items;
}

function createFilterObject() {
    const filter = {
        action: 'filter',
        params: {},
    };

    if (filterNameInput.value !== '') {
        filter.params['product'] = filterNameInput.value;
    }

    if (filterBrandInput.value !== '') {
        filter.params['brand'] = filterBrandInput.value;
    }

    if (filterPriceInput.value !== '') {
        filter.params['price'] = Number(filterPriceInput.value);
    }

    return filter;
}

function removeAllDup(list) {
    const uniqueList = [];
    const dictKeys = new Set();
    for (const dict of list) {
        if (!dictKeys.has(dict.id)) {
            dictKeys.add(dict.id);
            uniqueList.push(dict);
        }
    }
    return uniqueList;
}

async function loadPageProducts(page) {
    const infelicity = pageSize + 10;
    let offset = new Number;
    if (page == 1) {
        offset = 1;
    }
    else {
        offset = page * pageSize;
    }
    const object = createIdObject(offset, infelicity);
    const ids = await getData(object);
    const items = createItemObject(ids);
    const products = await getData(items);
    const uniqProducts = removeAllDup(products);
    renderProducts(uniqProducts.slice(0, pageSize));
}

async function init() {
    try {
        let currentPage = 1;
        loadPageProducts(currentPage);
        nextPageButton.addEventListener('click', async () => {
            if (!isFiltered) {
                currentPage++;
                loadPageProducts(currentPage);
                console.log('next page')
            }
        });

        prevPageButton.addEventListener('click', async () => {
            if (!isFiltered && currentPage > 1) {
                currentPage--;
                loadPageProducts(currentPage);
                console.log('previous page')
            }
        });
    } catch (error) {
        console.error(error);
        alert('Произошла ошибка. Проверьте консоль');
    }
}

const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const hash = md5(`${'Valantis'}_${stamp}`);
const url = 'http://api.valantis.store:40000/';

const pageSize = 50;

const productsContainer = document.getElementById('products');
const paginationContainer = document.getElementById('pagination');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

const filterNameInput = document.getElementById('name-filter');
const filterPriceInput = document.getElementById('price-filter');
const filterBrandInput = document.getElementById('brand-filter');
const filterButton = document.getElementById('filter-button-submit');
const filterButtonDrop = document.getElementById('filter-button-drop');

let isFiltered = false;

init()

filterButton.addEventListener('click', async () => {
    try {
        isFiltered = true;
        const filter = createFilterObject();
        const filteredIds = await getData(filter);

        const numPages = Math.ceil(filteredIds.length / pageSize);
        let currentPage = 1;

        const item = createItemObject(filteredIds.slice(0, pageSize));
        const filteredItems = await getData(item);
        renderProducts(filteredItems);

        nextPageButton.addEventListener('click', async () => {
            if (isFiltered) {
                currentPage++;
                const item = createItemObject(filteredIds.slice((currentPage - 1) * pageSize, currentPage * pageSize));
                const filteredItems = await getData(item);
                renderProducts(filteredItems);
                console.log('filter next page')
            }
        });

        prevPageButton.addEventListener('click', async () => {
            if (isFiltered && currentPage > 1) {
                currentPage--;
                const item = createItemObject(filteredIds.slice((currentPage - 1) * pageSize, currentPage * pageSize));
                const filteredItems = await getData(item);
                renderProducts(filteredItems);
                console.log('filter prev page')
            }
        });
    } catch (error) {
        console.error(error);
        alert('Произошла ошибка. Проверьте консоль');
    }
});

filterButtonDrop.addEventListener('click', async () => {
    init()
    isFiltered = false;
    filterNameInput.value = "";
    filterPriceInput.value = "";
    filterBrandInput.value = "";
});