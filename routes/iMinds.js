var DataLayer = require("../data/DataLayer_iMinds");
/*
 * GET home page.
 */

exports.index = function(req, res){

    var dataLayer = new DataLayer();

    dataLayer.update(req.session,"",
        function()
        {

            var data = dataLayer.getDashboardData(req.session);
            res.render('iMinds', { data: data.sortedData, verbs: data.verbs, targetsByContext: data.targetsByContext, contexts:data.contexts });
        }
    );

};