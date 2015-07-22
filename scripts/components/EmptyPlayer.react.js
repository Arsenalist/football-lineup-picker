
var React = require('react');
var Common = require('./common.js');

var EmptyPlayer = React.createClass({
  handleReplacePlayer: function() {
    Common.PitchActions.fillPosition(this.props.data);
  },
  render: function() {
    return (
      <div className="player">
        <img onClick={this.handleReplacePlayer} className="shirt" src="http://cdn.ismfg.net/static/plfpl/img/shirts/shirt_0.png"/>
      </div>
    );
  }
});
module.exports = EmptyPlayer;
