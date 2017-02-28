$(document).ready(function() {
	$(".sub-nav a").click(function(event) {
		event.preventDefault();
		$(this).parent().addClass("is-current");
		$(this).parent().siblings().removeClass("is-current");
		var tab = $(this).attr("href");
		$(".l-showcase").not(tab).css("display", "none");
		$(tab).fadeIn();
	});
});