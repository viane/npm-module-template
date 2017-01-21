const send = (url, method, data) => {
  const xhr = new window.XMLHttpRequest();
  const _e = encodeURIComponent;
  const isFormData = data instanceof window.FormData;
  let dataPairs = [];

  if (typeof data === 'object' && !isFormData) {
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        dataPairs.push(_e(key) + '=' + _e(data[key]));
      }
    }
    data = dataPairs.join('&').replace(/%20/g, '+');
  }

  const promise = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      }
    };
  });

  xhr.open(method, url);

  if (!isFormData) {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  xhr.send(data);

  return promise;
};

module.exports = {
  post: (url, data) => send(url, 'POST', data),
  get: (url, data) => send(url, 'GET', data),
  put: (url, data) => send(url, 'PUT', data),
  delete: (url, data) => send(url, 'DELETE', data),
};
