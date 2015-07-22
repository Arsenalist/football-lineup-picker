var FormationSelector = require('./FormationSelector.react.js');
var PlayerGroup = require('./PlayerGroup.react.js');
var PlayerGroupList = require('./PlayerGroupList.react.js');
var UserActions = require('./UserActions.react.js');
var PlayerFinder = require('./PlayerFinder.react.js');
var Common = require('./common.js');

var React = require('react');


var Pitch = React.createClass({
  getStateFromStore: function() {
    return Common.PitchStore.getState();
  },

  getInitialState: function() {
    var key = this.props.params.key;
    if (key) {
      console.log("loading from URls");
      Common.PitchActions.loadPitchData(key);
    } else {
      Common.PitchActions.setFormation('4-4-2');
    }
    console.log("initial state in pitch is ", this.getStateFromStore());

    return this.getStateFromStore();
  },

  componentDidMount: function() {
    // when the assignment store says its data changed, we update
    console.log("Pitch component mounted");
    Common.PitchStore.onChange = this.onChange;
  },

  onChange: function() {
    console.log("onChange in Pitch, calling setState");
    this.setState(this.getStateFromStore());
  },

  render: function() {
    if (!this.state.data){
      return <div className="spinner"></div>
    }
    return (
      <div>
      <div className="row">
        <div className="col-xs-6">
          <FormationSelector />
          <div className="pitch">
            <PlayerGroupList />
          </div>
          <UserActions />
        </div>
        <div className="col-xs-6">
          <PlayerFinder />
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Pitch;
