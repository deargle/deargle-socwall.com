var PasswordSecurityStudy = Class.extend({
    init: function(options) {
        this.options = $.extend(true, {
        }, options || {});

        // Generate a random number for the random treatment (1-4) or control (0)
        this.randomNumber = Math.floor(Math.random()*5);

        // Define the possible tip types
        this.tipTypes = ['control', 'staticText', 'dynamicText', 'strengthMeter', 'dynamicTextAndStrengthMeter'];

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
        var self = this;
        input = $(input);
        var tipContent = $('#'+input.attr('id')+'-tip .tipContent');

        // Handle random tip types
        if(tipType == 'random') {
            tipType = this.tipTypes[this.randomNumber];
        }

        // Handle control tip types
        if(tipType == 'control') {
            return;
        }

        // Get the appropriate tip via an API call
        if(password != '' && input.data('cache') != password) {
            // Store the new password in the cache
            input.data('cache', password);

            // Abort any existing remote requests
            if(this.remoteRequest != null) {
                this.remoteRequest.abort();
            }

            tipContent.empty();

            if(tipContent.find('.text').length == 0) {
                tipContent.append('\
                    <div class="text"><p class="analyzing">Analyzing...</p></div>\
                ');
            }

            
            this.remoteRequest = $.ajax({
                'url': '/api/getTip/password/'+encodeURIComponent(password)+'/tipType/'+tipType,
                'type': 'get',
                'dataType': 'json',
                'success': function(data) {
                    if (data != null) {
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
                                    tipContent.find('.text').html(data.response.text);
                                }
                            }
                        }
                    }
                }
            });
        }
        else if(password == '') {
            tipContent.html('<p>Please enter a password.</p>');
        }
    }
});
var passwordSecurityStudy = new PasswordSecurityStudy();