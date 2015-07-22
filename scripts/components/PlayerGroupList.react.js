var PlayerGroup = require('./PlayerGroup.react.js');
var Common = require('./common.js');

var React = require('react');
var PlayerGroupList = React.createClass({
  render: function() {
    if (jQuery.isEmptyObject(Common.PitchActions.getPitchData())) {
      console.log("compareing == true");
      return <div>Loading</div>;
    }
    var playerGroups = Common.PitchActions.getPitchData().playerGroups.map(function (playerGroup) {
      return (
        <PlayerGroup key={playerGroup.groupType} data={playerGroup} />
      );
    });
    return (
      <div className="playerGroups">
        {playerGroups}
      </div>
    );
  }
});
module.exports = PlayerGroupList;
