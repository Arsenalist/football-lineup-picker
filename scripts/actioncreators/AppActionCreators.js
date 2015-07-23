var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActionCreator = {
  getPlayers: function() {
    $.get( "http://api.thescore.com/epl/teams/56/players", function( data ) {
        data.sort(function(a, b) {
          return ((a.last_name < b.last_name) ? -1 : ((a.last_name > b.last_name) ? 1 : 0));
        });
        
        AppDispatcher.dispatch({
          actionType: AppConstants.RECEIVE_PLAYERS,
          players: data
        });

     });
  }
}

module.exports = AppActionCreator;