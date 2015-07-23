var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {string} text
   */
  addPlayer: function(player) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_PLAYER,
      player: player
    });
  },
  setPlayers: function(player) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_PLAYERS
    });
  }

};

module.exports = AppActions;