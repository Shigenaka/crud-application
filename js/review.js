Parse.initialize("U71Yme9Alr9zr9Y97ypoFMBLvyWNamVL6y6LzVkl", "56ELOFgjlXat2e8UjcJd2sw0GAnDm6fLRpgqsfur");

var Review = Parse.Object.extend('Review');

$('form').submit(function() {
 
	var review = new Review();
	
	$(this).find('input').each(function(){
		review.set($(this).attr('id'), $(this).val());
		$(this).val('');
	});

	review.save();
	return false
});