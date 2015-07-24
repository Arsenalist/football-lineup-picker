var EmptyPlayer = require('./EmptyPlayer.react.js');
var Player = require('./Player.react.js');
var ActivePlayer = require('./ActivePlayer.react.js');

var AppConstants = require('../constants/AppConstants.js');

var React = require('react');

var PlayerGroup = React.createClass({

  getInitialState: function(){
    return {
      players: this.props.data.players
    }
  },
  render: function() {
    var numPlayers = this.state.players.length;
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
    var players = this.state.players.map(function (player) {
      var component;
      if (player.markForReplacement) {
        component = <ActivePlayer/>
      } else if (player.name == "") {
        component = <EmptyPlayer data={player}/> 
      } else {
        component = <Player data={player}/>;
      }
      console.log(component);
      return (
        <div className={colClass}>
          {component}
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
