var self = require("self");
var selection = require("selection");
var tabs = require("tabs");
var widget = require('widget').Widget;
var panel = require('panel').Panel;
var request = require('request').Request;

exports.main = function() {
    var selectedText = {text: ''};

    function selectionChanged(event){
        selectedText.text = selection.text;
        selectedText.index = tabs.activeTab.index;
    }
    
    selection.on('select', selectionChanged);

    var kipptPanel = panel({
        width: 450,
        height: 232,
        contentURL: self.data.url('extension.html'),
        contentScriptFile: [ self.data.url('js/vendor/jquery.js'),
                             self.data.url('js/vendor/tipsy.js'),
                             self.data.url('js/kippt_moz_extension.js')],
        onShow: function(){
            kipptPanel.port.emit('show', {title: tabs.activeTab.title, url: tabs.activeTab.url, note: selectedText.text});
        }
    });
    
    widget({
        id: "kippt",
        label: "Kippt it",
        contentURL: self.data.url("icon.png"),
        panel: kipptPanel
    });


    kipptPanel.port.on('getList', function(message){
        request({
            url: 'https://kippt.com/api/lists/?limit=0&include_data=user',
            headers: {'X-Kippt-Username': message.name, 'X-Kippt-API-Token': message.token},
            onComplete: function(response){
                kipptPanel.port.emit('updateList', JSON.parse(response.text));
            }
        }).get();
    });
    
    kipptPanel.port.on('saveClip', function(message){
        request({
            url: 'https://kippt.com/api/clips/',
            headers: {'X-Kippt-Username': message.user.name, 'X-Kippt-API-Token': message.user.token},
            content: JSON.stringify(message.data),
            onComplete: function(response){
                console.log('>>>Save Clip: ' + response.text);
                kipptPanel.port.emit('clipSaved', 'saved');
            }
       }).post();
    });
};
