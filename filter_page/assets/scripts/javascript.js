const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const hash = md5(`${'Valantis'}_${stamp}`);
console.log(hash);
const url = 'http://api.valantis.store:40000/';

const data = {
  "action": "get_ids",
  "params": {
    "offset": 1,
    "limit": 3
  }
};

const request = new Request(url, {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'X-Auth': hash
  }
});

var product_list;

fetch(request)
  .then(response => response.json())
  .then(data => {
    const result = data.result;
    product_list = result;
    console.log(product_list);
  })
  .catch(error => console.error(error));
