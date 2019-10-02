export default function request(url, options) {
  // console.log(url, options);
  return fetch(url, options)
    .then(r => {
      return r.json().then(
        data => ({
          status: r.status,
          body: data,
        })
      )
    })
    .catch((error) => {
      // console.log(error);
      return error;
    });
}
