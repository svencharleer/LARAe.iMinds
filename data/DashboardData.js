//Basic data structure class to send back to the UI
var DashboardData = function()
{
    this.actor= "";
    this.timestamp="";
    this.verb="";
    this.content="";
    this.target="";
    this.context="";
    this.object ="";
    this.originalobject="";
}

module.exports = DashboardData;