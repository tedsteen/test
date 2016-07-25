#### Testing random things

* Make sure you have node installed https://nodejs.org/<br/>
* `npm install webpack -g`
* Go to a project of choice and do `npm install` and then either
 * `webpack` to build it to default target directory (`build/`) add `--watch` to make webpack poll for changes automatically
and run f.ex `python -m SimpleHTTPServer 8000` in `build/` to serve the page. Or...
 * install `npm install webpack-dev-server -g` and do `webpack-dev-server`.<br/>
 This is the same as step 2 (with `--watch`) but simpler.
