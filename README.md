# AJAX-JSON-wrapper
A wrapper class around the XMLHttpRequest-class, using JSON. 

Properties

  method - declares the method in which the request is made. Default is "POST"
  
  url - The target url for the request.
  
  asyncrone - decides if the request should be made syncrone or asyncrone. Default is tue.
  
  contentType - Declares the content type that the requested content is. Default is "application/x-wwww-form-urlencoded"."
  
  openHandler - function that fires when a request is being initialized.
  
  headerHandler - function that fires when the response headers are received. Passed aregument to the function is a associated array with all response headers.
  
  processingHandler - functions that fires when the response is being processed, i.e. Not fulle received yet.
  
  responseHandler - function that fires when the response has been received. 
  
  errorHandler - function that fires if there is an error. Arguments passed is the error message.
  
  requestHeaders - associated array containg additional headers.
  
  request - is a XMLHttpRequest object.
  
  
  Methods
  
    setErrorHandler(e) - sets the errorHandler to the passed function.
    
    setMethod(m) - sets the method. Passed argument is a string. Should be something like "POST" or "GET".
    
    setURL(u) - sets the url of the request. Most likely a file on the web such as http://www.example.com/resons.php.
    
    setAsyncrone(a) - sets asyncrone. Argument should be boolean. Should not really be changed from the default value.
    
    setContentType(c) - sets the content type header. This header is set explicitly, so as to make the wrapper class easier to use. Argument is a string. Unless the content sent with the request is something special, there is no need to change this from the default value.
    
    addHeader(name, value) - adds a custom header to the request. Argument is the name of the header and the value of the header as two strings.
    
    abort() - aborts the request.
    
    setOpenHandler(oh) - sets the openHandler function.
    
    setHeaderHandler(hh) - sets the headerHandler function.
    
    setProcessingHandler(ph) - sets the processingHandler function.
    
    setRespsoneHandler(rh) - sets the responseHandler function.
    
    execute() - executes the request. Before called, the errorHandler and the responseHandler should be set.
    
