var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {string} text
   */
  setPlayers: function(players) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_PLAYERS,
      players: players
    });
  },
  setLineup: function(lineup) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_LINEUP,
      lineup: lineup
    });
  },
  setFormation: function(formation, playerGroups) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_FORMATION,
      formation: formation,
      playerGroups: playerGroups
    });
  },
  addPlayer: function(player) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_PLAYER,
      player: player
    });
  },
  removePlayer: function(player) {
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_PLAYER,
      player: player
    });
  },
  markForReplacement: function(playerKey) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MARK_FOR_REPLACEMENT,
      playerKey: playerKey
    });
  }



};

module.exports = AppActions;