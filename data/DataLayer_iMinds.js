var DataLayer = require("./DataLayer");
var DashboardData = require("./DashboardData");
var TinCan = require('tincanjs');


//Hash function for unique ids
String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function DataLayer_iMinds()
{
}

DataLayer_iMinds.prototype = Object.create(DataLayer.prototype);

DataLayer_iMinds.prototype.continueToken = "";

//call tincan api. use continue token to keep fetching until no more data
DataLayer_iMinds.prototype.update = function(session, continueToken, callback)
{
    if(continueToken == "")
    {
        session.data = [];
        console.log("data reset");
    }
    var tc = new TinCan(
        {
            recordStores: [
                {
                    endpoint: "https://cloud.scorm.com/tc/DIZP5U8S1Y/",
                    username: "fQjJapWKQvRa-TLgALE",
                    password: "Z7vZmDg0sqknaKGQY_M",
                    actor: { "mbox":["<learner email>"], "name":["<Learner Name>"] },
                    registration: "<registration-uuid>"

                }
            ]
        }
    );
    tc.getStatements(
        {
            // 'params' is passed through to TinCan.LRS.queryStatements
            params: {
                since: "2014-03-6 08:59:52CDT", //dates for the course, hardcoded for this prototype
                until: "2014-03-30 08:59:52CDT",
                limit: 0,
                continueToken: continueToken

            },
            callback: function (err, result) {
                // 'err' will be null on success
                if (err !== null) {
                    // handle error
                    return;
                }
                if(session.data == {})
                    session.data = [];
                if(result.more != undefined)
                {

                    session.data = session.data.concat(result.statements);
                    var token = result.more.split('?continueToken=')[1];
                    console.log("data (partially) returned length is " + session.data.length);
                    //NOTE: continue token not supported by the node js tincapjs module. version in this git repository has been modified to support it
                    DataLayer_iMinds.prototype.update(session, token, callback);
                    return;
                }

                //save the data in the class
                session.data = session.data.concat(result.statements);


                callback();
            }
        });


}

//fetch and convert the data to the format understood by the visualization
DataLayer_iMinds.prototype.getDashboardData = function(session)
{
    var sortedData = {};
    var contexts = {};
    var targetsByContext = {};
    var verbs = [];


    console.log("data returned length is " + session.data.length);
    session.data.forEach(function(d){

        var dd = new DashboardData();
        dd.actor = d.actor.name;

        dd.timestamp = Date.UTC(new Date(d.timestamp).getFullYear(), new Date(d.timestamp).getMonth(), new Date(d.timestamp).getDate());;

        dd.verb = d.verb.id;
        //group by verbs
        if(verbs.indexOf(dd.verb) < 0) verbs.push(dd.verb);
        dd.target = d.target.id.hashCode();

        dd.coursematerial = {name: d.target.definition.toString(), url: d.target.id};
        //keep the raw data
        dd.raw = JSON.stringify(d);

        //group by context
        if(d.context == undefined
            || d.context.contextActivities == undefined
            || d.context.contextActivities.parent == undefined
            || d.context.contextActivities.parent[0] == undefined
            || d.context.contextActivities.parent[0].id == undefined)
            dd.context = "no context";
        else
            dd.context = d.context.contextActivities.parent[0].id;

        //is this an action happening today?
        var today = Date.UTC(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), new Date(Date.now()).getDate());
        if(dd.timestamp == today)
            dd.today = true;
        else dd.today = false;

        //by actor
        if(sortedData[dd.actor] == undefined)
            sortedData[dd.actor] = {};

        //by context
        if(sortedData[dd.actor][dd.context] == undefined)
            sortedData[dd.actor][dd.context] = {};
        if(contexts[dd.context] == undefined)
            contexts[dd.context] = dd.context;
        if(targetsByContext[dd.context] == undefined)
            targetsByContext[dd.context] = {};
        if(targetsByContext[dd.context][dd.target] == undefined)
            targetsByContext[dd.context][dd.target] = dd.target;


        //add the actions
        if(sortedData[dd.actor][dd.context][dd.target] == undefined)
            sortedData[dd.actor][dd.context][dd.target] = [];
        sortedData[dd.actor][dd.context][dd.target].push(dd);


    });
    return {sortedData:sortedData, verbs:verbs, targetsByContext: targetsByContext, contexts: contexts};
}



module.exports = DataLayer_iMinds;
