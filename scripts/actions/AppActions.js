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
  setTeams: function(teams) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECEIVE_TEAMS,
      teams: teams
    });
  },
  setCurrentTeam: function(team) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_CURRENT_TEAM,
      team: team
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
  setEmptyFormation: function(formation, playerGroups) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_EMPTY_FORMATION,
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
  },
  setMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_MESSAGE,
      message: message
    });
  },
  lineupSaved: function(lineup) {
    AppDispatcher.dispatch({
      actionType: AppConstants.LINEUP_SAVED,
      lineup: lineup
    });
  }



};

module.exports = AppActions;