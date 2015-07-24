var Message = require('./Message.react.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');
var AppStore = require('../stores/AppStore.js');
var React = require('react');
var Navigation = require('react-router').Navigation;
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');


var UserActions = React.createClass({

  mixins: [Navigation],

  getInitialState: function() {
    return {
      location: null
    };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({location: AppStore.getLocation()});
    if (this.state.location != null) {
      this.transitionTo(this.state.location);
    }
  },


  handleSave: function(e) {
    e.preventDefault();
    AppActionCreator.saveLineup(AppStore.getLineup());
  },
  render: function() {
    return (
      <div className="userActions">
        <input onClick={this.handleSave} type="button" className="btn btn-success" value="Save"/>
      </div>
    );
  }
});
module.exports = UserActions;
