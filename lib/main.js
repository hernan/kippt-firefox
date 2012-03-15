exports.main = function() {
    var currentUrl = '';
    var currentTitle = '';
    var currentSelection = '';
    
    var self = require("self");

    var selection = require("selection");

    var selectedText = '';

    function selectionChanged(event){
        selectedText = selection.text;
    }

    selection.on('select', selectionChanged);
    
    // Create panel for kippt
    var kipptPanel = require("panel").Panel({
        width:400,
        height:245,
        contentURL : "https://kippt.com/extensions/new/?"
                    +"url="+currentUrl
                    +"&title="+currentTitle
                    +"&notes="+selectedText
    });
    
    // Create widget that will show panel on click
    require("widget").Widget({
        id: "kippt",
        label: "Click to kippt",
        contentURL: self.data.url("icon.png"),
        onClick: function(){
            var tabs = require("tabs");
            var currentUrl = tabs.activeTab.url;
            var currentTitle = tabs.activeTab.title;
            
            kipptPanel.show();
        }
    });

};