
self.port.on('show', function(data){
  Kippt.data = data;
  Kippt.init();
});

var Kippt = {
  data: {},
  user: { name: 'usermame',
          token: 'user-token' },
  
  init: function(){
    this.initForm();
    this.getList();

    self.port.on('updateList', Kippt.updateList);
  },
  
  closePopover: function(){
    
  },
   
  getListCache: function(){
    Kippt.listCache = localStorage.getItem('kipptListCache');
    if (Kippt.listCache) {
        Kippt.updateLists(JSON.parse(listCache));
    }
  },
  
  getList: function(){
    self.port.emit('getList', Kippt.user);
  },
  
  updateList: function(response){
    Kippt.loadList(response.objects);
  },
  
  loadList: function(data){
    var datal = data.length;
    
    $('#id_list').html('');
    
    for (var i=0; i < datal; i++) {
      var list = data[i],
          title;
      
      // Add user to title if not the current user
      if (Kippt.userId && Kippt.userId != list['user']['id']){
        title = list['title'] + ' (' + list['user']['username'] + ')';
      }
      else{
        title = list['title'];
      }

      $('#id_list').append(new Option(title, list['id'], true, true));
    }
    
    $('#id_list option').first().attr('selected', 'selected');
    
    $('#id_list').append('<option id="new-list-toggle" value="-newList-">-- New list --</option>');
    
    //TODO: move to init form
    $('#id_list').on('change', function(){
        if ($(this).val() === '-newList-') {
            $('#id_list').hide();
            $('#new_list').css('display', 'inline-block');
            $('#id_new_list').focus();
        }
    });
  },
  
  create_spinner: function(){
    var opts = {
      lines: 9,
      length: 2,
      width: 2,
      radius: 3,
      rotate: 0,
      color: '#111',
      speed: 1,
      trail: 27,
      shadow: false,
      hwaccel: false,
      className: 'spinner',
      zIndex: 2e9,
      top: 'auto',
      left: 'auto'
    };
    
    return new Spinner(opts).spin();
  },

  initForm: function(){
    $('#id_title').val(this.data.title.trim());
    //$('#id_url').val(this.data.url);
    $('#id_notes').val(this.data.note.trim());
    $('textarea').focus();
    
    $('#submit_clip').on('click', function(e){
        console.log('submit');
        // Data
        var data = {
            url: Kippt.data.url,
            title: $('#id_title').val(),
            notes: $('#id_notes').val(),
            list: $('#id_list').val(),
            source: 'firefox'
        };
        
        var services = [];
        
        // Read later
        if( $('#id_is_read_later').is(':checked') ){
            data.is_read_later = true;
        }
        
        /*if( existingClipId ){
            data.id = existingClipId;
        }*/
        
        // New list
        if( $('#id_new_list').val() ){
            data.new_list = {};
            data.new_list.title = $('#id_new_list').val();
            data.new_list.is_private = $('#id_private').is(':checked') ? true : false;
        }
        
        // Shares
        $('.share:checked').each(function(i, elem){
            services.push( $(elem).data('service') );
        });
        
        data.share = services;

        self.port.emit('saveClip', {user: Kippt.user, data: data} );
        Kippt.closePopover();
    });
  }
  
};

