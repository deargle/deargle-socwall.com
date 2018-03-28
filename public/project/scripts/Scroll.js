var ScrollClass=Class.extend({options:{},document:$(document),window:$(window),ajax:null,infinite:function(options){var self=this;self.options.infinite=$.extend(true,{'startingOffset':null,'itemsAvailable':null,'itemsPerRequest':null,'url':null,'data':{},'currentOffsetVariableName':'currentOffset','itemsPerRequestVariableName':'itemsPerRequest','paginationVariableName':'pagination','itemContainerVariableName':'itemContainer','itemContainerClass':'itemContainer','paginationClass':'pagination','dividerClass':'projectScrollInfiniteDivider','loaderClass':'projectScrollInfiniteLoader','insertionMethod':'inject','showDivider':false,'currentOffset':null,'requestBreakLimit':null,'requestCount':1,'requestBreakText':'Show more results','loadingText':'Loading more results...','currentPage':null,'totalPages':null,'active':false,'previousScrollPosition':0},options||{});if(!self.options.infinite.currentOffset){self.options.infinite.currentOffset=self.options.infinite.startingOffset;}
self.options.infinite.totalPages=Math.ceil(self.options.infinite.itemsAvailable/self.options.infinite.itemsPerRequest);this.window.scroll(function(){var currentScrollPosition=self.window.scrollTop();var scrollingDown=false;if(currentScrollPosition>self.options.infinite.previousScrollPosition){scrollingDown=true;}
self.options.infinite.previousScrollPosition=currentScrollPosition;var scrollPoint=(self.document.height()/5);var reachedScrollPoint=self.window.scrollTop()>=(self.document.height()-self.window.height()-scrollPoint);if(scrollingDown&&reachedScrollPoint){self.infiniteScroll();}});},infiniteScroll:function(){var self=this;if(!self.options.infinite.active&&!self.options.infinite.ajaxRequest&&(self.options.infinite.currentOffset<=self.options.infinite.itemsAvailable)){self.options.infinite.active=true;if(self.options.infinite.requestBreakLimit!==null&&self.options.infinite.requestCount>self.options.infinite.requestBreakLimit){if($('.'+self.options.infinite.dividerClass+'.break').length==0){$('.'+self.options.infinite.itemContainerClass+':last').append('<div class="'+self.options.infinite.dividerClass+' break"><p class="center"><a onclick="Scroll.options.infinite.requestBreakLimit = null; Scroll.infiniteScroll(); $(this).parent().parent().remove();">'+self.options.infinite.requestBreakText+'</a>.</p></div>');}
self.options.infinite.active=false;return;}
$('.'+self.options.infinite.itemContainerClass+':last').after('<div class="'+self.options.infinite.loaderClass+'"><p>'+self.options.infinite.loadingText+'</p></div>');self.options.infinite.currentPage=Math.ceil(self.options.infinite.currentOffset/self.options.infinite.itemsPerRequest);self.options.infinite.divider='<div class="'+self.options.infinite.dividerClass+'"><p class="right"><a onclick="Scroll.top();">Back to Top</a></p><p class="left"><!--.03 secs--></p><p class="center">Page <b>'+self.options.infinite.currentPage+'</b> of <b>'+self.options.infinite.totalPages+'</b></p></div>';self.options.infinite.data[self.options.infinite.currentOffsetVariableName]=self.options.infinite.currentOffset;self.options.infinite.data[self.options.infinite.itemsPerRequestVariableName]=self.options.infinite.itemsPerRequest;self.options.infinite.ajaxRequest=$.ajax({'type':'POST','dataType':'json','url':self.options.infinite.url,'data':self.options.infinite.data,'success':function(data){self.options.infinite.currentOffset+=self.options.infinite.itemsPerRequest;if(self.options.infinite.showDivider){$('.'+self.options.infinite.loaderClass+':last').replaceWith($(self.options.infinite.divider));}
else{$('.'+self.options.infinite.loaderClass+':last').remove();}
if(self.options.infinite.insertionMethod=='inject'){$('.'+self.options.infinite.itemContainerClass+':last').append($(data[self.options.infinite.itemContainerVariableName]).children());}
else if(self.options.infinite.insertionMethod=='append'){$('.'+self.options.infinite.paginationClass).before(data[self.options.infinite.itemContainerVariableName]);}
$('.'+self.options.infinite.paginationClass).replaceWith(data[self.options.infinite.paginationVariableName]);self.options.infinite.requestCount++;self.options.infinite.active=false;self.options.infinite.ajaxRequest=null;}});}},elementTop:function(element,options){options=$.extend(true,{'onAfter':function(){},'onBefore':function(){},'offsetTop':18},options||{});options.onBefore();$('html,body').animate({scrollTop:$(element).offset().top-options.offsetTop},'slow',function(){options.onAfter();});},top:function(){Scroll.elementTop($('body'));}});var Scroll=new ScrollClass();