example-analytics-backend
=========================

This is an example backend for the videogular-analytics plugin.


Setup
-----

`npm install` can be run to install the npm dependencies.

The [Videogular Heatmap](https://github.com/soton-ecs-2014-gdp-12/videogular-heatmap) module specified in the `bower.json` file have not been released yet.
 To get them, clone their repositories and run `bower link` in the root of each repository. Then, in the `example-analytics-backend` directory, tell Bower to use your local copy:

```sh
$ bower link videogular-heatmap
```

Important: This will not work without doing this.

Configuring an Apache webserver to run this application
=======================================================

Apache cannot directly run node.js webservices therefore it needs to be ran by node itself.

This can be run by using `npm start` which will run the node server. This needs to be running on the server all the time you want the server to be accessible.
A web search will return details of how to turn a node.js webserver into a service however it can just be run from the command line using screen or a similar program.

You can configure apache to proxy any connections to the node server. This is how we suggest integrating an apache server with node.

To do this mod_proxy needs to be installed, web searches will find guides to install this for your chosen operating system.

Then the apache httpd.conf file needs to be configured by adding the following entry somewhere in the file:

	<VirtualHost <hostname>:80>
		ServerName <hostname>
		ErrorLog logs/analytics-error_log
		CustomLog logs/analytics-access_log common
	
		ProxyRequests off
	
		<Proxy *>
			Order deny,allow
			Allow from all
		</Proxy>
	
		<Location />
			ProxyPass <analytics address>
			ProxyPassReverse <analytics address>
		</Location>
	</VirtualHost>

Parameters needing changes:

* `<hostname>` is the hostname of the server. e.g. hostname.domain.com
* `<analytics address>` is the URL for the analytics server. This is displayed when npm start is run. by default this is `http://localhost:5001/`
* The `ErrorLog` and `CustomLog` parameters can be changed to any location
