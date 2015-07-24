var PlayerGroup = require('./PlayerGroup.react.js');

var React = require('react');
var PlayerGroupList = React.createClass({
  render: function() {
    console.log("playergrouplist render", this.props);
    if (jQuery.isEmptyObject(this.props.lineup)) {
      return <div>Loading</div>;
    }
    var playerGroups = this.props.lineup.playerGroups.map(function (playerGroup) {
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
