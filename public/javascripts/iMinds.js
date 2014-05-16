/**
 * Created by svenc on 28/02/14.
 */
var colors = ["#33FF99","#33CCFF","#CCFF33","#FF0066","#CCFFFF","#FF66CC","#99CC66","#9999FF","#FFCC66", "#FF9966"];


//on click on event, load content and find related content
function loadContent(data, td)
{
    $("#eventData").html("");
    var list = document.createElement('ul');
    $(list).appendTo("#eventData");

    //get all the data for the thread
    var toAdd = data.objects;

    //sort the items by time in the threadview on the right
    toAdd.sort(function(a,b){
        if(a.timestamp < b.timestamp) return -1;
        else return 1;
    })
    toAdd.forEach(function(d){
        var listItem = document.createElement('li');

        var link = '<div><a href="'+d.coursematerial.url+'" target="_blank">.go to source</a></div>';
        var verb = d.verb.split("/");
        verb = verb[verb.length-1];
        var text =  "<em>" + d.actor + "</em> " + verb + " <strong>" + d.coursematerial.name.toString() + "</strong>" + link;
        $(listItem).html(text).appendTo(list);

    });


}


//visualization variables
var heighestNumberOfEvents_ForAPhase = 50;
var sizeOfBox = 16;
var width = 120;
var spacingBetweenSquares = 2;
var columns  = parseInt(width / (sizeOfBox + spacingBetweenSquares));
var numberOfRows = (heighestNumberOfEvents_ForAPhase / columns);
var height = numberOfRows *  (sizeOfBox + spacingBetweenSquares);

//draws for each context and user the activities
function drawPhase(gdata, user, context)
{
    //d3.js
    var tr = d3.selectAll('tr[userid="'+ user +'"]');
    //create the headers
    if(tr[0].length == 0)
    {
        console.log("tr  for" + user +  " added");
        var table = d3.select('table[id="userdata"]');
        tr = table.append("tr")
            .attr("userid", user)

            .attr("class","box_vis");
        tr.append("td")
            .attr("class","studentname")
            .html(user);
        Object.keys(days).forEach(function(v){
            tr.append("td")
                .attr("userid", user)
                .attr("contextid",v)
                .attr("class","visualization hideable")
                .attr("min-height","40px")
                .attr("day", days[v].day)
                ;
        });

        //add "no context" as well
        tr.append("td")
            .attr("userid", user)
            .attr("contextid","no context")
            .attr("class","visualization hideable")
            .attr("min-height","40px")
            .attr("day", -1)

        ;
    }
    var data = [];
    for(var targetKey in targetsByContext[context])
    {
        if(gdata[targetKey] == undefined)
            data.push({count: 0, objects:[]});
        else
        {
            data.push({count: gdata[targetKey].length, objects:gdata[targetKey]});

        }
    }
    data = data.sort(function(a, b){ return d3.ascending(a.timestamp, b.timestamp); });


    //create the events in the visualization
    var svgCollection = d3.select('td[userid="'+ user +'"][contextid="' + context + '"]');
    svgCollection.selectAll("svg")
            .data(data)
            .enter()
            .append("svg")
            .attr("class", "vis_circle")
            .attr("height", 16)
            .attr("width",16)
            .append("circle")
            .attr("cx", 8)
            .attr("cy", 8)
            .attr("r", function(d){
                if(d.count == 0)
                    return 3;
                if(d.count < 2)
                    return 3;
                if(d.count< 5)
                    return 6;
                return 10;
            })

            .attr("class", function(d,i){
                 if(d.count == 0)
                    return "eventSquare outline_circle_color" + i;
                 else
                    return "eventSquare circle_color" + i;
            })
            .attr("objects", function(d){ return d.objects;})

            .on("click",function(d){ loadContent(d, 'td[userid="'+ user +'"][contextid="' + context + '"]'); })
            .on("mouseover", function(d){});

}

function filterUsers(user)
{

    if(user != "all")
    {
        $(".box_vis").hide();
        $('[userid="' + user + '"]').show();

    }
    else{
        $(".box_vis").show();
    }
}

function filterModules(module)
{

    if(module != "all")
    {
        $(".hideable").hide();
        $('[day="' + module + '"]').show();

    }
    else{
        $(".hideable").show();
    }
}


