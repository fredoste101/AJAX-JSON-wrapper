function JSONRequest()
{
	var method = "POST";
	var url;
	var asyncrone = true;
	var contentType = "application/x-www-form-urlencoded";
	var openHandler, headerHandler, processingHandler, reponseHandler, errorHandler;
	var request = new XMLHttpRequest();
	var postData;

	//Setters/Configuration

	this.setErrorHandler = function(e)
	{
		errorHandler = e;
	}

	this.setMethod = function(m)
	{
		method = m;
	}

	this.setURL = function(u)
	{
		url = u;
	}

	this.setAsyncrone = function(a)
	{
		asyncrone = a;
	}

	this.setContentType = function(c)
	{
		contentType = c;
	}
	
	//Expect the FormData class!
	this.setPostData = function(data)
	{
		if(data instanceof FormData)
		{
			postData = data;	
		}
		else
		{
			throw "setPostData: data must be an instance of FormData.";	
		}
	}

	this.abort = function()
	{
		request.abort();
	}

	//Functions handlers

	this.setOpenHandler = function(oh)	//Function that fires when connection is established
	{
		openHandler = oh;
	}

	this.setHeaderHandler = function(hh)	//Function that fires when connection has received headers. Passed argument: associative array with http-headers
	{
		headerHandler = hh;
	}

	this.setProcessingHandler = function(ph)	//Functions that fires when data is being processed
	{
		processingHandler = ph;
	}
	
	this.setResponseHandler = function(rh)	//Function that fires when all data has been received. Passed arguement: the received JSON-object
	{
		responseHandler = rh;
	};

	
	//Execute

	this.execute = function()
	{
		request.onreadystatechange = function()
		{
			try
			{
				switch(this.readyState)
				{
					case 1:
						fireOpenHandler();	//Server connection established: open() has been called
					break;
					case 2:
						fireHeaderHandler();	//Request received: status and headers available
					break;
					case 3:
						fireProcessingHandler(); //Processing request (receiving data): responseText holds partial data
					break;
					case 4:
						fireResponseHandler();	//The response has been received and the request is therefore finished.
					break;
					default:
						throw "ERROR: Unknown readystate in request";
					break;
				}
			}
			catch(e)
			{
				if(isHandlerSet(errorHandler))
				{
					errorHandler(e);
				}
			}
		};
		
		request.open(method, url, asyncrone);
		request.setRequestHeader("Content-type", contentType);
		if(postData != null)
		{
			request.send(postData);
		}
		else
		{
			request.send();
		}
		
	};
	

	//Private helper functions.

	function fireOpenHandler()
	{
		if(isHandlerSet(openHandler))
		{
			openHandler();	
		}
	}

	function fireHeaderHandler()
	{
		if(isHandlerSet(headerHandler))
		{
			headerHandler(responseHeaderArray(request.getAllResponseHeaders()));	
		}
	}

	function fireProcessingHandler()
	{
		if(isHandlerSet(processingHandler))
		{
			processingHandler();	
		}
	}

	function fireResponseHandler()
	{
		if(isHttpStatusOk())
		{
			responseHandler(JSON.parse(request.responseText));
		}
		else if(isRequestAborted())
		{
			//request aborted!
		}
		else
		{
			throw "HTTP response code: " + request.status;
		}
	}

	function isHandlerSet(handler)
	{
		return typeof openHandler == "function";
	}

	function isHttpStatusOk()
	{
		return request.status == 200;
	}

	function isRequestAborted()
	{
		return request.status == 0;
	}
	
	//GIT: 706839, for getting the http-response-headers in a neat associative array
	function responseHeaderArray(headerStr)
	{
		var headers = {};
		if (!headerStr)
		{
			return headers;
		}
		var headerPairs = headerStr.split('\u000d\u000a');
		for (var i = 0; i < headerPairs.length; i++)
		{
			var headerPair = headerPairs[i];
			// Can't use split() here because it does the wrong thing
			// if the header value has the string ": " in it.
			var index = headerPair.indexOf('\u003a\u0020');
			if (index > 0)
			{
				var key = headerPair.substring(0, index);
				var val = headerPair.substring(index + 2);
				headers[key] = val;
			}
		}
		return headers;
	}

}
