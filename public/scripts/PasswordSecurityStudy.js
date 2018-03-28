var PasswordSecurityStudy=Class.extend({initialize:function(options){this.options=$.extend(true,{},options||{});this.randomNumber=Math.floor(Math.random()*4);this.tipTypes=['control','staticText','dynamicText','strengthMeter'];this.tipType='strengthMeter';this.staticText='<div class="susceptibility"> <p>Hackers can guess common or simple passwords in a matter of <span class="timeToCrack veryInsecure">minutes or less</span>.</p> </div> <div class="severity"> <p> Having your password guessed means a hacker would be able to access other accounts that use a similar password. </p> </div> <div class="selfEfficacy"> <p>You can easily make your password more secure:</p> <ul class="static"> <li class="checked">Avoid common passwords likely to be on a hacker password list</li> <li class="checked">Make it 8 characters long or more</li> <li class="checked">Add a lowercase character</li> <li class="checked">Add an uppercase character</li> <li class="checked">Add a number</li> <li class="checked">Add a special character (e.g., *, &, $)</li> <li class="checked">Add a space</li> <li class="speechBubble">Try using a passphrase like this:<br />"I like chocolate chip cookies."</li> </ul> </div> <div class="responseEfficacy"> <p>Following these simple suggestions will make your password take <span class="timeToCrack verySecure">a thousand years</span> to guess.</p> </div>';var self=this;$(document).ready(function(){$('#registerTreatment').val(self.tipType);if(self.tipType=='staticText'){$('#pssResults').append('\
                    <div class="text">'+self.staticText+'</div>\
                ').show();}});this.remoteRequest=null;this.colors={0:'#FF3D3A',20:'#FFD13A',40:'#FFF83A',50:'#3AFF3D',80:'#3A93FF'};},getTip:function(input,password,tipType){if(!tipType){tipType=this.tipType;}
if(tipType=='control'){$('#registerTreatment').val(tipType);}
if(password!=''&&$(input).data('cache')!=password){var self=this;input=$(input);var tipContent=$('#pssResults');if(tipType!=='staticText'){tipContent.empty();}
if(tipType!=='control'){tipContent.show();}
if(tipContent.find('.text').length==0&&tipType!='control'){if(tipType=='staticText'){tipContent.append('\
                        <div class="text">'+this.staticText+'</div>\
                    ');}
else{tipContent.append('\
                        <div class="text"><p class="analyzing">Analyzing...</p></div>\
                    ');}
registerObject.adjustHeight();}
if(password==''){tipContent.html('<p>Please enter a password.</p>');}
if(this.timeout){clearTimeout(this.timeout);this.timeout=setTimeout(function(){self.getTipCallback(input,password,tipType);},1000);}
else{this.timeout=setTimeout(function(){self.getTipCallback(input,password,tipType);},1000);}}},getTipCallback:function(input,password,tipType){var self=this;input=$(input);var tipContent=$('#pssResults');if(tipType=='random'){tipType=this.tipTypes[this.randomNumber];}
$('#registerTreatment').val(tipType);if(password!=''&&input.data('cache')!=password){input.data('cache',password);if(this.remoteRequest!=null){this.remoteRequest.abort();}
if(tipType!='staticText'){tipContent.empty();}
if(tipContent.find('.text').length==0){if(tipType=='staticText'){tipContent.append('\
                        <div class="text">'+this.staticText+'</div>\
                    ');}
else{tipContent.append('\
                        <div class="text"><p class="analyzing">Analyzing...</p></div>\
                    ');}}
$('#register .nextButton').attr('disabled',true);this.remoteRequest=$.ajax({'url':'/api/passwordsecuritystudy/getTip/tipType:'+tipType+'/','type':'post','dataType':'json','data':'password='+encodeURIComponent(password),'success':function(data){self.timeout=null;$('#register .nextButton').attr('disabled',false);if(data.status=='success'){if(data.response.status=='success'){if(data.response.passwordStrength!=null){if(tipContent.find('.passwordStrengthBarWrapper').length==0){tipContent.find('.text').before('\
                                        <p class="passwordStrengthText analyzing">Analyzing</p><div class="passwordStrengthBarWrapper"><div class="passwordStrengthBar"></div></div>\
                                    ');}
var color='red';for(var key in self.colors){if(data.response.passwordStrength>key){color=self.colors[key];}}
tipContent.find('.passwordStrengthBar').animate({'width':data.response.passwordStrength+'%','background-color':color},function(){});tipContent.find('.passwordStrengthText').removeClass('analyzing').html('<b>'+data.response.passwordStrengthText+'</b>');if(data.response.text!=null){tipContent.find('.text').html(data.response.text);}
else{tipContent.find('.text').empty();}}
else if(data.response.text!=null){tipContent.find('.text').html(data.response.text);}}
registerObject.adjustHeight();}
else{$('#registerTreatment').val('failure');}},'failure':function(data){$('#register .nextButton').attr('disabled',false);$('#registerTreatment').val('failure');}});}
else if(password==''){tipContent.html('<p>Please enter a password.</p>');}}});var passwordSecurityStudy=new PasswordSecurityStudy();