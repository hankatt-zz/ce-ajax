// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(document).ready(function() {

	$("form").submit(function(e) {
		/* Stop default behavior and prevent event bubbling */
		e.preventDefault();
		e.stopPropagation();

		/* Define variable to clarify the AJAX call */
		var url = $(this).attr('action'); //Returns something like /posts or submit.php, etc, where the form is processed
		var type = (window.activeAction === "edit") ? 'PUT' : 'POST'; 
		//var type = $(this).attr('method'); Can't identify if it's POST or PUT through this.
		var data = "";

		$(".editable").each(function() {
			if(data === "")
				name = $(this).attr('name').replace('[', '%5B').replace(']', '%5D');
			else
				name = "&" +$(this).attr('name').replace('[', '%5B').replace(']', '%5D');

			data += name +"=" +getSerialized($(this).html()); //Concat input value to data string.
		});

		/* Submit the form */
		$.ajax({
			url: url,
			type: type,
			data: data
		}).success(function(d) {
			$("body").append('<div class="success">Done!</div>');
		});

		return false;
	});
});

/* 
	: All split's are necessary to ensure special characters won't fuck up the text rendering/prevent submit

	: Options to the last big replace RegExp above, more explicit:
		.split('<div><br></div>').join('<br>') //-webkit- hack to avoid an extra linebreak being rendered
		replace(/<(p|div|br)[^>]*>/g, "/n") //Replace contentEditable linebreaks with URL
		.replace(/<\/?\w+[^>]*>/g, ""); //Clear </p>, </div>, etc rendered by browsers

	: Also these ones can be considered one-liner options (unsure about speed on all of them)
		(((([^div>|^/])?<br>)?[/]?</div>)?<div>)
		((</div>|<div>(?=<br>))*<(p|div|br)*>)?<(div|/div)>
*/
function getSerialized(msg) {
	return msg
		.split('%').join('%25') //Replace % with with URL-encoding (Important to this one first since the others include % symbol)
		.split(' ').join('+') //Replace spaces with +
		.split('&amp;').join('%26') //Replace & with URL-encoding
		.split(';').join('%3B') //Replace forbidden char ; with URL-encoding
		.replace(/((<\/div>|<div>(?=<br>))*<(p|div|br)*>)?<(div|\/div)>/g, "%0D%0A"); //Returns the same for all browsers
}