var EmptyPlayer = require('./EmptyPlayer.react.js');
var Player = require('./Player.react.js');

var React = require('react');

var PlayerGroup = React.createClass({
  render: function() {
    var numPlayers = this.props.data.players.length;
    var colClass;
    switch(numPlayers) {
        case 1:
            colClass = 'col-xs-12';
            break;
        case 2:
            colClass = 'col-xs-6';
            break;
        case 3:
            colClass = 'col-xs-4';
            break;
        case 4:
            colClass = 'col-xs-3';
            break;
        case 5:
            colClass = 'col-xs-2';
            break;
        default:
            colClass = 'col-xs-12';
    }
    colClass = colClass;
    var players = this.props.data.players.map(function (player) {
      var playerOrEmpty = player.name == "" ? <EmptyPlayer key={player.key} data={player}/> : <Player key={player.key} onRemovePlayer={this.removePlayer} key={player.name} data={player}/>;
      return (
        <div className={colClass}>
          {playerOrEmpty}
        </div>
      );
    }.bind(this));
    return (
      <div className="playerGroup row">
      {players}
      </div>
    );
  }
});

module.exports = PlayerGroup;
