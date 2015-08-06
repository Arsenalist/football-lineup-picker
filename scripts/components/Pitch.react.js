var FormationSelector = require('./FormationSelector.react.js');
var PlayerGroup = require('./PlayerGroup.react.js');
var PlayerGroupList = require('./PlayerGroupList.react.js');
var UserActions = require('./UserActions.react.js');
var PlayerFinder = require('./PlayerFinder.react.js');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');

var React = require('react');


var Pitch = React.createClass({

  getInitialState: function() {
    var key = '';
    // TODO: Fix multiple things happening
    // TODO: Retrieve teamId from server when key is present and set it elsewhere
    if (this.props.params.teamId) {
      AppActionCreator.setCurrentTeam(this.props.params.teamId);
    }
    if (this.props.params.key) {
      key = this.props.params.key;      
    }    
    return {
      lineup: {},
      key: key
    };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    if (this.state.key) {
      AppActionCreator.getLineup(this.state.key);
    } else {
      AppActionCreator.setFormation('4-4-2');
    }
  },

  _onChange: function() {
    this.setState({
      lineup: AppStore.getLineup()
    });
  },


  render: function() {
    return (
      <div>
      <div className="row">
        <div className="col-xs-12 col-sm-9 col-md-7 col-lg-6">
          <FormationSelector />
          <div className="pitch">
            <PlayerGroupList lineup={this.state.lineup}/>
          </div>
          <UserActions />
        </div>
        <div className="col-xs-12 col-sm-3 col-md-5 col-lg-6">
          <PlayerFinder />
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Pitch;
