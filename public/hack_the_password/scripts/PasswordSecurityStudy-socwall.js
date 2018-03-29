var PasswordSecurityStudy = Class.extend({
    init: function(options) {
        this.options = $.extend(true, {
            }, options || {});
        
        // Generate a random number for the random treatment (1-4) or control (0)
        this.randomNumber = Math.floor(Math.random()*4); // changed to 4 to account from removing dynamicTextAndStrengthMeter

        // Define the possible tip types and select one
        this.tipTypes = ['control','staticText','dynamicText','strengthMeter']; // removed dynamicTextAndStrengthMeter
        //this.tipType = this.tipTypes[this.randomNumber];
        
        //this.tipType = 'control';
        //this.tipType = 'staticText';
        //this.tipType = 'dynamicText';
        //this.tipType = 'strengthMeter';
        this.tipType = treatment.type; // globally set before initialization of this class
        
        this.tipContentQuery = '#registerPassword-tip .tipContent';
        
        this.staticText = '<div class="susceptibility"> <p>Hackers can guess common or simple passwords in a matter of <span class="timeToCrack veryInsecure">minutes or less</span>.</p> </div> <div class="severity"> <p> Having your password guessed means a hacker would be able to access other accounts that use a similar password. </p> </div> <div class="selfEfficacy"> <p>You can easily make your password more secure:</p> <ul class="static"> <li class="checked">Avoid common passwords likely to be on a hacker password list</li> <li class="checked">Make it 8 characters long or more</li> <li class="checked">Add a lowercase character</li> <li class="checked">Add an uppercase character</li> <li class="checked">Add a number</li> <li class="checked">Add a special character (e.g., *, &, $)</li> <li class="checked">Add a space</li> <li class="speechBubble">Try using a passphrase like this:<br />"I like chocolate chip cookies."</li> </ul> </div> <div class="responseEfficacy"> <p>Following these simple suggestions will make your password take <span class="timeToCrack verySecure">a thousand years</span> to guess.</p> </div>';
        
        var self = this;
        
        // Set the treatment type on the register form
        $(document).ready(function() {
            $('#registerTreatment').val(self.tipType);
            
            // Show the static text tip on load
            if(self.tipType == 'staticText') {
                $('#pssResults').append('\
                    <div class="text">'+self.staticText+'</div>\
                ').show();
            }
        });
        
        this.remoteRequest = null;

        this.colors = {
            0: '#FF3D3A',
            20: '#FFD13A',
            40: '#FFF83A',
            50: '#3AFF3D',
            80: '#3A93FF'
        };
    },
    
    getTip: function(input, password, tipType) {
        // If a specific tip type is not provided, make it random
        if(!tipType) {
            tipType = this.tipType;
        }
        
        //console.log('Tip type:', tipType);
        
        if(tipType == 'control') {
            $('#registerTreatment').val(tipType);
        }
        
        // If the password has changed
        if(password != '' && $(input).data('cache') != password) {
            var self = this;
            input = $(input);
            //var tipContent = $('#'+input.attr('id')+'-tip .tipContent');
            var tipContent = $('#pssResults');
            
            
            if(tipType !== 'staticText') {
                tipContent.empty();
            }
            
            if(tipType !== 'control') {
                tipContent.show();
            }
            
            if(tipContent.find('.text').length == 0 && tipType != 'control') {
                if(tipType == 'staticText') {
                    tipContent.append('\
                        <div class="text">'+this.staticText+'</div>\
                    ');
                }
                else {
                    tipContent.hide();
                    tipContent.append('\
                        <div class="text"><p class="analyzing">Analyzing...</p></div>\
                    ');
                    tipContent.slideDown('fast');
                }
                
            //registerObject.adjustHeight();
            }

            if(password == '' && tipType != 'control') {
                tipContent.html('<p>Please enter a password.</p>');
            }

            if(this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function() {
                    self.getTipCallback(input, password, tipType);
                }, 1000 );
            }
            else {
                this.timeout = setTimeout(function() {
                    self.getTipCallback(input, password, tipType);
                }, 1000 );
            }
        }
    },

    getTipCallback: function(input, password, tipType) {
        var self = this;
        input = $(input);
        //var tipContent = $('#'+input.attr('id')+'-tip .tipContent');
        var tipContent = $('#pssResults');
        
        
        // Handle random tip types
        if(tipType == 'random') {
            tipType = this.tipTypes[this.randomNumber];
        }
        //console.log('tipType');
        
        $('#registerTreatment').val(tipType);

        // Get the appropriate tip via an API call
        if(password != '' && input.data('cache') != password) {
            // Store the new password in the cache
            input.data('cache', password);

            // Abort any existing remote requests
            if(this.remoteRequest != null) {
                this.remoteRequest.abort();
            }

            if(tipType != 'staticText') {
                tipContent.empty();
            }

            if(tipContent.find('.text').length == 0) {
                if(tipType == 'staticText') {
                    tipContent.append('\
                        <div class="text">'+this.staticText+'</div>\
                    ');
                }
                else {
                    tipContent.append('\
                        <div class="text"><p class="analyzing">Analyzing...</p></div>\
                    ');
                }
                
            }
            
            $('#register .nextButton').attr('disabled', true);

            this.remoteRequest = $.ajax({
                'url': '/api/getTip/password/'+encodeURIComponent(password)+'/tipType/'+tipType,
                'type': 'get',
                'dataType': 'json',
                //                'data': 'password='+encodeURIComponent(password),
                'success': function(data) {
                    if (data != null) {
                        self.timeout = null;

                        $('#register .nextButton').attr('disabled', false);

                        if(data.status == 'success') {
                            if(data.response.status == 'success') {
                                if(data.response.passwordStrength != null) {
                                    // Create the password strength meter if necessary
                                    if(tipContent.find('.passwordStrengthBarWrapper').length == 0) {
                                        tipContent.find('.text').before('\
                                            <p class="passwordStrengthText analyzing">Analyzing</p><div class="passwordStrengthBarWrapper"><div class="passwordStrengthBar"></div></div>\
                                        ');
                                    }

                                    var color = 'red';
                                    for(var key in self.colors) {
                                        if(data.response.passwordStrength > key) {
                                            color = self.colors[key];
                                        }
                                    }
                                    tipContent.find('.passwordStrengthBar').animate({
                                        'width': data.response.passwordStrength + '%',
                                        'background-color': color
                                    }, function() {

                                        });
                                    tipContent.find('.passwordStrengthText').removeClass('analyzing').html('<b>'+data.response.passwordStrengthText+'</b>');

                                    // Add text if it is present
                                    if(data.response.text != null) {
                                        tipContent.find('.text').html(data.response.text);
                                    }
                                    else {
                                        tipContent.find('.text').empty();
                                    }
                                }
                                else if(data.response.text != null) {
                                    //console.log(data.response.text);
                                    tipContent.hide();
                                    tipContent.find('.text').html(data.response.text);
                                    tipContent.slideDown('fast');
                                }
                            }

                        //registerObject.adjustHeight();
                        }
                        else {
                            $('#registerTreatment').val('failure');
                        }
                    }
                },
                'failure': function(data) {
                    $('#register .nextButton').attr('disabled', false);
                    
                    $('#registerTreatment').val('failure');
                }
            });
        }
        else if(password == '' && tipType != 'control') {
            tipContent.html('<p>Please enter a password.</p>');
        }
    }
});
var passwordSecurityStudy = new PasswordSecurityStudy();