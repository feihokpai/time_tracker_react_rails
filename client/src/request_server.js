function requestServer(httpMethod, url, callback, callbackError){
  fetch(url, { method: httpMethod, mode: "cors", })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();        
    })
    .then(callback)
    .catch(callbackError);
}

export default requestServer;
