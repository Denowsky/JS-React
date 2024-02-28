async function get_data(action) {
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

async function append_options(options) {
    const brandFilter = document.getElementById('brand-filter');
    options.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
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

async function init() {
    const object = createIdObject(1, pageSize);
    const ids = await get_data(object);
    const items = createItemObject(ids);
    const products = await get_data(items);
    console.log(products);
    // renderProducts(items);
    // console.log(items.length);
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
const filterButton = document.getElementById('filter-button');

init()

filterButton.addEventListener('click', async () => {
    try {
        const filter = createFilterObject();
        const filteredIds = await get_data(filter);

        const numPages = Math.ceil(filteredIds.length / pageSize);
        let currentPage = 1;

        const item = createItemObject(filteredIds.slice(0, pageSize));
        const filteredItems = await get_data(item);
        renderProducts(filteredItems);

        nextPageButton.addEventListener('click', async () => {
            currentPage++;
            const item = createItemObject(filteredIds.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            const filteredItems = await get_data(item);
            renderProducts(filteredItems);
        });

        prevPageButton.addEventListener('click', async () => {
            currentPage--;
            const item = createItemObject(filteredIds.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            const filteredItems = await get_data(item);
            renderProducts(filteredItems);
        });
    } catch (error) {
        console.error(error);
        alert('Произошла ошибка. Проверьте консоль');
    }
});