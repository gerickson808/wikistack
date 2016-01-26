
var mongoose = require('mongoose');
var marked = require('marked');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pageSchema = new Schema({
  title: {type:String, required: true},
  urlTitle: {type:String, required: true},
  content: {type:String, required: true},
  date: {type: Date, default: Date.now},
  status: {type: String, enum:['open', 'closed']},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags: {type: [String], index: true}
});

pageSchema.virtual('route').get(function(){
	return '/wiki/'+this.urlTitle;
});

pageSchema.virtual('renderedContent').get(function(){
	return marked(this.content);
});

pageSchema.pre('validate', function(next) {
	if(!this.title.length) this.title = "title" + Math.floor(Math.random()*1999);
	this.urlTitle = this.title.replace(/\ /g,"_").replace(/\W/g,"");
  next();
});

pageSchema.statics.findByTag = function (tag) {
	return Page.find({ 
		tags: {
			$elemMatch: { $eq: tag } 
			}
	});
};

pageSchema.methods.findSimilar = function () {
  return Page.find({tags: { $in: this.tags }, title: { $ne: this.title } });
  // return this.model('Animal').find({ type: this.type }, cb);
};

var userSchema = new Schema({
	name: {type:String, required: true},
	email: {type:String, required: true, unique:true},
});

userSchema.statics.findOrCreate = function(query, msg){
	return User.findOne(query).exec()
	.then(function(user){
		console.log(user);
		if (!user) {
			user = new User({
				email:msg.email,
				name:msg.name
			});
		}
		console.log(user);
		return user.save();
	});
};
userSchema.virtual('route').get(function(){
	return '/users/'+this._id.toString();
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);


module.exports = {
	Page: Page,
	User: User
};
