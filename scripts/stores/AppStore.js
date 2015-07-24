var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _players = [];
var _lineup = {};
var _formation = null;
var _message = null;
var _location = null

var AppStore = assign({}, EventEmitter.prototype, {

  setLocation: function(lineup) {
    _location = '/pitch/' + lineup.key;
  },

  isPlayerAlreadyAdded: function(playerKey) {
    var playerGroups = _lineup.playerGroups;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].key == playerKey) {
          return true;
        }
      }
    }
    return false;
  },


  addPlayer: function(player) {
    var playerGroups = _lineup.playerGroups;
    if (this.isPlayerAlreadyAdded(player.key)) {
      return;
    }
    var highestRank = null;
    var targetI = -1, targetJ = -1;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].markForReplacement) {
          playerGroups[i].players[j] = JSON.parse(JSON.stringify(player));  
          return;
        }
      }
    }
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        var rank = playerGroups[i].eligiblePositions.indexOf(player.position);
        if (rank == -1) {
          continue;
        }        
        if (playerGroups[i].players[j].name == "") {
          if (highestRank == null || rank < highestRank) {
            targetI = i;
            targetJ = j;
            highestRank = rank;
          }
        }
      }
    }
    if (targetI != -1 && targetJ != -1) {
      playerGroups[targetI].players[targetJ] = JSON.parse(JSON.stringify(player));        
    }

  },

  removePlayer: function(player) {
    var playerGroups = _lineup.playerGroups;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].name == player.name) {
          playerGroups[i].players[j].name = "";
        }
      }
    }
  },

  markForReplacement: function(playerKey) {
    var playerGroups = _lineup.playerGroups;
    for (var i=0; i<playerGroups.length; i++) {
      for (var j=0; j<playerGroups[i].players.length; j++) {
        if (playerGroups[i].players[j].key == playerKey) {
          playerGroups[i].players[j].markForReplacement = true;
        } else {
          playerGroups[i].players[j].markForReplacement = false;
        }
      }
    }
  },

  getLocation: function() {
    return _location;
  },

  getMessage: function() {
    return _message;
  },

  getPlayers: function() {
  	return _players;
  },

  getLineup: function() {
    return _lineup;
  },

  getFormation: function() {
    return _formation;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AppConstants.RECEIVE_PLAYERS:
       _players = action.players;
       AppStore.emitChange();
         break;
    case AppConstants.RECEIVE_LINEUP:
       _lineup = action.lineup;
       AppStore.emitChange();
         break;
    case AppConstants.SET_FORMATION:
       _formation = action.formation;
       _lineup.playerGroups = action.playerGroups
       AppStore.emitChange();
         break;
    case AppConstants.ADD_PLAYER:
       AppStore.addPlayer(action.player);
       AppStore.emitChange();
         break;
    case AppConstants.REMOVE_PLAYER:
       AppStore.removePlayer(action.player);
       AppStore.emitChange();
         break;
    case AppConstants.MARK_FOR_REPLACEMENT:
       AppStore.markForReplacement(action.playerKey);
       AppStore.emitChange();
         break;
    case AppConstants.SET_MESSAGE:
       _message = action.message;
       AppStore.emitChange();
         break;
    case AppConstants.LINEUP_SAVED:
       _lineup = action.lineup;
       AppStore.setLocation(action.lineup);
       AppStore.emitChange();
         break;
    default:
      // no op
  }
});

module.exports = AppStore;