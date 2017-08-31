var config,
    plugins = [],
    text= [],
    index= 0;

function recognize(text) {
    for(plugin of plugins) {
        for(cmd in plugin.cmds) {
            if(text.indexOf(cmd) != -1) {
                return plugin.cmds[cmd].callback(text);
            }
        }
    }
    
    /*if(lang =='fr') {
        return 'commande inconnue';
    } else { */
        return 'command not found';
    //}
}

function handleKeyDown(event) {
    if(event.which==13) {
        text.push($('#enter').val());
        $('#enter').val('');

        var oldtext = '<p class="old"><span>Nicolas@Brondin></span>'+text[text.length-1]+'</p>';
        $(oldtext).insertBefore('#current');
        var newtext = '<p class="old">'+recognize(text[text.length-1])+'</p>';
        $(newtext).insertBefore('#current');
        $.scrollTo('#current',20);
        index=0;
    } else if(event.which==38) {
        //Gestion de l'historique des commandes
        if(index<text.length)
        {
            $('#enter').val(text[text.length-1-index]);
            index++;
        }
    } else if(event.which==40) {
        if(index>0)
        {
            index--;
            $('#enter').val(text[text.length-1-index]);
        }
    } else if(event.which==9) {
        //Gestion de l'autocomplétion
        $('#enter').focus();
        if(event.preventDefault) 
        {
            event.preventDefault();
        }
    }
};


    //Init the CLI with the config file
    $.ajax({dataType: "json", url:"js/config.json",  success: function(data) {
        config = data;
        $(document).prop('title', config.title);
        $('body').append("<p>"+config.welcome+"</p>");
        $('body').append('<p id="current"><span>'+config.session+'</span><input type="text" id="enter" size="70"/></p>');
        $('#enter').focus();
        $(document).click(function() { $('#enter').focus(); });
        $('#enter').keydown(handleKeyDown);	
    }});
    
    //Load all the plugins
    $.ajax({dataType: "json", url:"js/plugins/dependencies.json",  success: function(manifest) {
        console.log(manifest);
      for(plugin of manifest) {
          console.log(plugin);
          $.getScript( 'js/plugins/'+plugin.url+"/plugin.js", function(data, status) {
              console.log(status);
              //Plugins loaded
          });
      }
    }});


		