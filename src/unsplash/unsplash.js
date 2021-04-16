export const API_URL = 'https://api.unsplash.com';
const stringifyQuery = function (obj = {}) {
  return Object.keys(obj)
    .map(function (k) {
      const keyString = encodeURIComponent(k) + '=';
      return keyString + encodeURIComponent(obj[k]);
    })
    .filter(Boolean)
    .join('&');
};

const buildOptions = function (options) {
  let { method, query } = options;
  let url = `${this._apiUrl}${options.url}`;
  url = `${url}?${stringifyQuery(query)}`;
  let headers = Object.assign({}, this._headers, options.headers);
  return {
    url,
    options: { method, query, headers },
  };
};
const photos = function () {
  return {
    getPhotos: (page = 1, perPage = 10, orderBy = 'latest') => {
      const url = '/photos';
      const query = {
        page,
        per_page: perPage,
        order_by: orderBy,
      };
      return this.request({
        url,
        query,
        method: 'GET',
      });
    },
    getPhoto: (id) => {
      const url = `/photos/${id}`;
      return this.request({
        url,
        method: 'GET',
      });
    },
  };
};

export class Unsplash {
  photos;
  _apiUrl;
  _secret;
  _accessKey;

  /**
   * @param {Object} options
   */
  constructor(options) {
    this._apiUrl = options.apiUrl || API_URL;
    this._accessKey = options.accessKey;
    this._secret = options.secret;

    this.photos = photos.bind(this)();
  }

  jsonBody = function (res) {
    return typeof res.json === 'function' ? res.json() : res;
  };

  /* 
  url
  method,
  query,
  headers,
  body
   */
  request(requestOptions) {
    const { url, options } = buildOptions.bind(this)(requestOptions);
    return fetch(url, options).then(this.jsonBody);
  }
}
