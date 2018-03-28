var Dialog=Class.extend({initialize:function(options){this.options=$.extend(true,{'ajax':false,'class':false,'header':false,'content':false,'footer':false,'footerCloseButtonText':'OK','modal':true,'modalOverlay':true,'modalOverlayClass':false,'closeAnimation':{'animation':'fade','duration':150},'closeButton':false,'closeOnModalOverlayClick':true,'closeOnEscapeKey':true,'onAfterShow':false,'onBeforeShow':false,'onAfterClose':false,'onBeforeClose':false,'reloadOnClose':false,'redirectOnClose':false,'redirect':null},options||{});this.window=$(window);this.ajax=null;this.create();},create:function(){var self=this;if(this.options.modalOverlay){this.modalOverlay=$('<div class="dialogModalOverlay"></div>');}
if(this.options.modalOverlayClass!==false){this.modalOverlay.addClass(this.options.modalOverlayClass);}
this.dialogWrapper=$('\
            <div style="display: none;" class="dialogWrapper">\
                <div class="dialog">\
                </div>\
            </div>\
      ');this.dialog=this.dialogWrapper.find('.dialog');if(this.options.header!==false){this.dialog.append($('<div class="dialogHeader">'+this.options.header+'<span class="closeButton"><span></div>'));}
this.dialog.append($('<div class="dialogContent"></div>'));this.dialogContent=this.dialog.find('.dialogContent');if(this.options.ajax===false){this.setContent(this.options.content);}
if(this.options.footer!==false){if(this.options.footer===true){this.options.footerText='';}
else{this.options.footerText=this.options.footer;}
this.dialog.append($('<div class="dialogFooter">'+this.options.footerText+'<span class="closeButton">'+this.options.footerCloseButtonText+'</span></div>'));}
this.dialog.find('.closeButton').click(function(event){self.destroy({'closeAnimation':{'animation':'fade','duration':0}});});if(this.options['class']!==false){this.dialogWrapper.addClass(this.options['class']);}
if(this.options.modalOverlay){this.modalOverlay.hide();$('body').children().last().after(this.modalOverlay);if($.browser.msie&&$.browser.version==="8.0"){this.modalOverlay.show();}else{this.modalOverlay.fadeIn(500);}}
$('body').children().last().after(this.dialogWrapper);this.dialog.css({'position':'absolute'});this.show();if(this.options.ajax!==false){this.loadAjaxContent();}},loadAjaxContent:function(){this.dialogContent.html('<div class="dialogLoader">Loading...</div>');var self=this;this.options.ajax.success=function(data){self.setContent(data);if(self.options.ajax.onSuccess&&typeof(self.options.ajax.onSuccess)==='function'){self.options.ajax.onSuccess();}};this.ajax=$.ajax(this.options.ajax);},setContent:function(content){this.dialog.css({'left':'-99999px'});this.dialogContent.html(content);this.updatePosition();},close:function(options){return this.destroy(options);},destroy:function(options){if(!options){options={};}
var self=this;if(this.options&&this.options.onBeforeClose){this.options.onBeforeClose();}
if(this.options&&this.options.reloadOnClose){this.dialog.find('button').text('Reloading...');document.location.reload(true);return this;}
if(this.options&&this.options.redirectOnClose){document.location=this.options.redirect;return this;}
if(!options.closeAnimation){options.closeAnimation=this.options.closeAnimation;}
if(options.closeAnimation.animation==='fade'){this.dialogWrapper.fadeOut(options.closeAnimation.duration,function(){self.dialogWrapper.remove();});}else{this.dialogWrapper.remove();}
if(this.options.modalOverlay){this.modalOverlay.fadeOut(250,function(){self.modalOverlay.remove();});}
if(this.options.closeOnEscapeKey){$(window).unbind('keyup');}
if(this.ajax){this.ajax.abort();}
if(this.options&&this.options.onAfterClose){this.options.onAfterClose();}
if(options&&options.onSuccess){options.onSuccess();}
return this;},show:function(){var self=this;if(this.options&&this.options.onBeforeShow){this.options.onBeforeShow();}
if(this.options.closeOnModalOverlayClick){this.dialogWrapper.click(function(event){if($(event.target).attr('class')===self.dialogWrapper.attr('class')){self.destroy();}});if(this.options.modalOverlay){this.modalOverlay.click(function(event){if($(event.target).attr('class')===self.modalOverlay.attr('class')){self.destroy();}});}}
if(this.options.closeOnEscapeKey){$(window).keyup(function(event){if(event.keyCode===27){self.destroy();}});}
if(this.dialogWrapper.find('.dialogContent img').length>0){this.dialogWrapper.css('visibility','hidden').show();var image=this.dialogWrapper.find('.dialogContent img:first');image.load(function(){self.updatePosition();self.dialogWrapper.hide().css('visibility','');self.dialogWrapper.fadeIn(150,function(){self.updatePosition();});});}else{this.dialogWrapper.fadeIn(150,function(){self.updatePosition();});}
this.window.resize(function(event){self.updatePosition();});this.updatePosition();if(this.options&&this.options.onAfterShow){this.options.onAfterShow();}},updatePosition:function(){var self=this;this.dialog.trigger('positionUpdated');this.dialog.css({'left':self.getLeftMargin()});this.dialog.css({'top':self.getTopMargin()});if(this.options.modalOverlay){this.modalOverlay.width(self.window.width()).height($(document).height());}},resizeToContent:function(){},getLeftMargin:function(){return(this.window.width()/2)-(this.dialog.outerWidth()*0.5);},getTopMargin:function(){var topMargin=(this.window.height()/2.5)-(this.dialog.height()/2)+this.window.scrollTop();return topMargin>0?topMargin:0;}});