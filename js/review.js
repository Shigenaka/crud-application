//initialize parse
Parse.initialize("U71Yme9Alr9zr9Y97ypoFMBLvyWNamVL6y6LzVkl", "56ELOFgjlXat2e8UjcJd2sw0GAnDm6fLRpgqsfur");

//creates new parse object
var Review = Parse.Object.extend('Review');

//creates a rating for the review form
$('#reviewRating').raty({ path:'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.0/images', size: 24});

//gets data from a submitted form
$('form').submit(function() {
 
	var review = new Review();
	
	//adds the int value of the rating
	review.set('rating', parseInt($('#reviewRating').raty('score'), 10));

	//adds everything else
	$(this).find('input, textarea').each(function(){
		review.set($(this).attr('id'), $(this).val());
		$(this).val('');
	});

	//saves the data
	review.save(null, {
		success:getData
	});
	return false
});

//called if saving to parse is successful
var getData = function() {
	var query = new Parse.Query(Review)

	//searches for non empty reviews
	query.notEqualTo('description', '')

	query.find({
		success:function(results) {
			buildList(results)
		} 
	})
}

var buildList = function(data) {
	$('#reviews').empty()

	data.forEach(function(item){
		addItem(item);
	})
}

//adds review to bottom of page
var addItem = function(item) {
	var title = item.get('title')
	var platform = item.get('platform')
	var description = item.get('description')
	var rating = item.get('rating')
	
	var div = $('<div class="well"><h3>' + title + '</h3><p>Console: ' + platform + '</p><p>' + description + '<p></div>');
	
	var ratyRate = $('.well').raty({ path:'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.0/images', readOnly: true, score: rating });
	$('h3').prepend(ratyRate);

	var deleteMe = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
	
	deleteMe.click(function() {
		item.destroy({
			success:getData
		})
	})

	div.prepend(deleteMe);
	$('#reviews').append(div)
	
}

getData()