export const cacheUtils = {
  setCache: (key, data) => {
    // const item = {
    //   data,
    //   expiry: new Date().getTime() + 3600000, // Cache for 1 hour (3600000 ms)
    // };
    // console.log("saving in cache: ", key);
    // sessionStorage.setItem(key, JSON.stringify(item));
  },

  getCache: (key) => {
    // const itemStr = sessionStorage.getItem(key);
    // if (!itemStr) return null;

    // const item = JSON.parse(itemStr);
    // const isExpired = new Date().getTime() > item.expiry;

    // if (isExpired) {
    //   sessionStorage.removeItem(key);
    //   return null;
    // }
    // console.log("serving from cache: ", key);

    // return item.data;
  },
};
