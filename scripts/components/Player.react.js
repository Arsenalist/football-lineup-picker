var Common = require('./common.js');
var React = require('react');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');

var Player = React.createClass({
  handleRemove: function() {
    AppActionCreator.removePlayer(this.props.data);
  },
  render: function() {
    return (
      <div className="player">
        <img key={this.props.key} className="shirt" src="http://cdn.ismfg.net/static/plfpl/img/shirts/shirt_1.png"/>
        {this.props.data.name}
        <div>
          <img onClick={this.handleRemove} src="http://cdn.ismfg.net/static/plfpl/img/icons/out.png"/>
        </div>
      </div>
    );
  }
});
module.exports = Player;
