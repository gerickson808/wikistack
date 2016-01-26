module.exports = function(swig) {

  var pageLink = function (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };

  pageLink.safe = true;

  swig.setFilter('pageLink', pageLink);

  var userLink = function (user) {
    return '<a href="' + user.route + '">' + user.name + '</a>';
  };

  userLink.safe = true;

  swig.setFilter('userLink', userLink);

  var joinTags = function(tags) {
  	if(!tags.length) return "";
  	var result = [];
  	return tags.map(function(tag){
  		 return '<a href="/wiki/search?tag=' + tag + '">' + tag + '</a>';
  	}).join(", ");
  };

  joinTags.safe = true;
  swig.setFilter('joinTags', joinTags);


};