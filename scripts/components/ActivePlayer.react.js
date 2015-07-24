
var React = require('react');

var ActivePlayer = React.createClass({
  render: function() {
    return (
      <div className="player">
        <img className="shirt" src="http://i.imgur.com/fzzIaP8.png"/>
      </div>
    );
  }
});
module.exports = ActivePlayer;
