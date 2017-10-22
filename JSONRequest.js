//Class for requesting

function JSONRequest()
{
	var method = "POST";																//The method of the request. post by defualt.
	var url;																			//The url to which the request will be done
	var asyncrone = true;																//Asyncrone request is by default true.
	var contentType = "application/x-www-form-urlencoded";					//Content type. Default value is default for regular form.
	var openHandler, headerHandler, processingHandler, reponseHandler, errorHandler;	//Functions for handling stages of request-response
	var abortHandler, timeoutHandler, progressHandler;
	var request = new XMLHttpRequest();													//The xmlhttprequest that is wrapped by this.
	var postData;																		//FormData object with data send in request.
	var timeout = 0;																	//Time the request has to finish, before aborted. Given in millisecons. Default is no timeout.

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

	this.setOpenHandler = function(oh)	//Function that fires when connection is established. NO ARGUMENTS.
	{
		openHandler = oh;
	}

	this.setHeaderHandler = function(hh)	//Function that fires when connection has received headers. PASSED ARGUMENT: associative array with response http-headers
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

	this.setAbortHandler = function(ah)	//Functions that fires when request is aborted
	{
		abortHandler = ah;
	}

	this.setProgressHandler = function(ph)
	{
		progressHandler = ph;
	}

	this.setTimeout = function(t, th)
	{
		request.timeout = t;
		timeoutHandler = th;
	}
	 
	//Execute

	this.execute = function()
	{
		request.open(method, url, asyncrone);
		
		
		if(postData != null)
		{
			request.send(postData);
		}
		else
		{
			request.setRequestHeader("Content-type", contentType);
			request.send();
		}
	};
	

	//Events

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

	request.onabort = function()
	{
		fireAbortHandler();
	}

	request.upload.onprogress = function(event)	//NOTE THAT THIS IS ONLY FOR UPLOAD
	{
		fireProgressHandler(event);	
	}

	request.ontimeout = function()
	{
		fireTimeoutHandler();
	}


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

	function fireAbortHandler()
	{
		if(isHandlerSet(abortHandler))
		{
			abortHandler();
		}
	}

	function fireProgressHandler(progress)
	{
		if(isHandlerSet(progressHandler))
		{
			progressHandler(progress.loaded, progress.total);
		}
	}

	function fireTimeoutHandler()
	{
		if(isHandlerSet(timeoutHandler))
		{
			timeoutHandler();
		}
	}

	function isHandlerSet(handler)
	{
		return typeof handler == "function";
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







