$(document).ready(function () {
	$('body').particleground({
		dotColor: '#5cbdaa',
		lineColor: '#5cbdaa'
	})
	$('.link').css({
		'margin-left': ($('#intro-icon').width() - 300) / 4
	})
	$(".next a,.prev a").click(function(event){
		event.preventDefault()
		$(this).parent().parent().fadeOut("slow")
	})
	$(".next a").click(function(event){
		$(this).parent().parent().next().fadeIn("slow")
	})
	$(".prev a").click(function(event){
		$(this).parent().parent().prev().fadeIn("slow")
	})
})