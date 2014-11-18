/*
 * Script for the fauna management ui.  Currently used just to change the
 * count of certain creatures
 * * * * */

function incCount(domobj) {
  // Get the form using the parent selector, then the input element using the
  // children selector
  var input = $(domobj).parent().children("input");

  // Increase it's value by one
  $(input).val( parseInt($(input).val()) + 1 );

  // And set the count display to the value as well
  $("#newCount").html($(input).val());
}

function decCount(domobj) {
  // Get the form using the parent selector, then the input element using the
  // children selector
  var input = $(domobj).parent().children("input");

  // Decrease it's value by one
  $(input).val( parseInt($(input).val()) - 1 );

  // And set the count display to the value as well
  $("#newCount").html($(input).val());
}
