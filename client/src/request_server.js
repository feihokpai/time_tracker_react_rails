function requestServer(httpMethod, url, parameters, callback, callbackError){
  const completeUrl = "http://localhost:3000/"+url;
  const isForm = httpMethod === "POST" && parameters != null;
  const contentType = 'application/json';
  const fetchParameters = { method: httpMethod, mode: "cors" };
  if(isForm){
    fetchParameters.body = JSON.stringify(parameters);
    fetchParameters.headers = { 'Content-Type': contentType };
  }
  
  fetch(completeUrl, fetchParameters)
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
