var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _players = [];


var AppStore = assign({}, EventEmitter.prototype, {

  getPlayers: function() {
  	return _players;
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

	console.log("registred");
  switch(action.actionType) {
    case AppConstants.RECEIVE_PLAYERS:
       _players = action.players;
       AppStore.emitChange();
         break;
    default:
      // no op
  }
});

module.exports = AppStore;