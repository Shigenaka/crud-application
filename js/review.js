//initialize parse
Parse.initialize("U71Yme9Alr9zr9Y97ypoFMBLvyWNamVL6y6LzVkl", "56ELOFgjlXat2e8UjcJd2sw0GAnDm6fLRpgqsfur");

//creates new parse object
var Review = Parse.Object.extend('Review');

//creates a rating for the review form
$('#reviewRating').raty({ size: 24});

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

	review.set('pos', 0);
	review.set('total', 0);

	//saves the data
	review.save(null, {
		success:getData
	});
	return false
});

//called if saving to parse is successful
var getData = function() {
	var query = new Parse.Query(Review)

	//searches for reviews with ratings
	query.exists('rating')

	query.find({
		success:function(results) {
			buildList(results)
		} 
	})
}

var buildList = function(data) {
	$('#reviews').empty()
	data.forEach(function(item, revCount){
		addItem(item);
	})
}

var revCount = 0;
var revScore = 0;
var averageScore = 0;
//adds review to bottom of page
var addItem = function(item) {
	revCount++;
	var title = item.get('title');
	var platform = item.get('platform');
	var description = item.get('description');
	var rating = item.get('rating');

	var pos = item.get('pos');
	var total = item.get('total');

	revScore += rating;

	var div = $('<div class="well"></div>');
	var voting = $('<span></span>')
	var userRating = $("<div></div>");
	var title = $('<h3>' + title + '</h3>');
	var console = $('<p>Console: ' + platform + '</p>');
	var descrip = $('<p>' + description + '<p>');
	var useful = $('<p>' + pos + ' out of ' + total + ' found this useful<p>');

	var thumbsUp = $('<button id="thumbs" class="btn btn-primary btn-xs thumbup"><i class="fa fa-thumbs-up"></i></button>');
	var thumbsDown = $('<button id="thumbs" class="btn btn-primary btn-xs"><i class="fa fa-thumbs-down"></i></button>')

	userRating.raty({
		score: rating,
		readOnly: true,
		half: true
	});

	div.append(thumbsDown);
	div.append(thumbsUp);
	div.append(userRating);
	userRating.append(title);
	div.append(console);
	div.append(descrip);
	div.append(useful);

	var deleteMe = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
	
	deleteMe.click(function() {
		item.destroy({
			success:getData
		})
	})

	//calculates reviews and takes into account new clicks
	thumbsUp.click(function() {
		item.increment('pos')
		item.increment('total')
		item.save();
		getData()
	});

	thumbsDown.click(function() {
		item.increment('total')
		item.save();
		getData()
	});

	div.prepend(deleteMe);
	$('#reviews').append(div)
	
	//creates average rating
	$('#average').raty({
		readOnly: true,
		half: true,
		score: revScore/revCount
	});
}

getData()