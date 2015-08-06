
var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Pitch = require('./components/Pitch.react.js');
var TeamSelector = require('./components/TeamSelector.react.js');
var App = require('./components/App.react.js');
// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="/pitch/:key" handler={Pitch}/>
    <Route path="/pitch/new/:teamId" handler={Pitch}/>
    <Route path="/pitch" handler={TeamSelector}/>
  </Route>
);

ReactRouter.run(routes, ReactRouter.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById('content'));
});
