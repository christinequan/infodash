function query_top(cb) {
  return fetch(`api/top`)
    .then(checkStatus)
    .then(parseText)
    .then(cb)
}

function get_brands(cb){
  return fetch('api/getbrands')
    .then(checkStatus)
    .then(parseText)
    .then(cb)
}

function query_affinity(query, cb){
  const baseURL = 'api/affinity/';
  const url = baseURL + encodeURIComponent(query);
  return fetch(url)
          .then(checkStatus)
          .then(parseText)
          .then(cb)
}

// URL.searchParams -> new but something to consider
function query_counthhs(params, cb){
  const baseURL = 'api/counthhs?';
  let paramArr = [];
  params.map(param => {
    let key = encodeURIComponent(param[0]);
    let val = encodeURIComponent(param[1]);
    if (val) {paramArr.push(key + '=' + val);}
  });
  let paramStr = paramArr.join('&')
  console.log(baseURL + paramStr);
  let url = baseURL + paramStr;
  return fetch(url)
          .then(checkStatus)
          .then(parseText)
          .then(cb)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseText(response) {
  return response.text();
}

export {query_top, get_brands, query_counthhs, query_affinity};
