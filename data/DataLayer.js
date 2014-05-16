

function DataLayer()
{
}

DataLayer.prototype.data = [];

DataLayer.prototype.update = function(callback)
{
    //connect to system and fetch (new) data
}
DataLayer.prototype.getDashboardData = function()
{
    //return data, formatted in the dashboarddata structure
}

module.exports = DataLayer;


