/** Page model */

var ModelParserUtil = {
	parseToPhotoObject: parseToPhotoObject,
	parseToCommentObject: parseToCommentObject,
}

function parseToPhotoObject(data) { 
	photo = new Photo();
	photo.setId(data.id);
	photo.setUrl(data.source);
	photo.setAlbumName(data.album.name);
	photo.setAlbumId(data.album.id);
	photo.setName(data.name);

	return photo;
}

function parseToCommentObject(data) {
	console.log("parseData", data);
	comment = new Comment();
	comment.setId(data.id);
	comment.setAuthor(data.from.name);
	comment.setAuthorId(data.from.id);
	comment.setAuthorAvatar(data.from.picture.data.url);
	comment.setMessage(data.message);
	comment.setCreatedAt(data.created_time);

	return comment;
}


function Page() {
	this.name = "";
	this.cover = "";
	this.creatorName = "";
	this.username = "";
}

Page.prototype = {
	setName: function(pageName) {
		this.name = pageName;
	},

	getName: function() {
		return this.name;
	},

	setCover: function(cover) {
		this.cover = cover;
	},

	getCover: function() {
		return this.cover;
	},

	setCreatorName: function(creator) {
		this.creatorName = creator;
	},

	setUsername: function(username) {
		this.username = username;
	},

	getUsername: function() {
		return this.username;
	}
}

/** Album model */
function Album() {
	/** Properties */
	this.id = "";
	this.name = ""
	this.photos = [];
	this.created_at = "";
	this.photosCount = 0;
	this.coverPhoto = "";
}

Album.prototype = {

	setId: function(id) {
		this.id = id;
	},

	getId: function() {
		return this.id;
	},
	/**
	 * @param {String} name [description]
	 */
	 setName: function(name) {
	 	this.name = name;
	 },

	/**
	 * @param {Integer} count [description]
	 */
	 setPhotosCount: function(count) {
	 	this.photosCount = count;
	 },

	/**
	 * @param {String} created_at [description]
	 */
	 setCreatedAt: function(created_at) {
	 	this.created_at = created_at
	 },

	/**
	 * @return {String} [description]
	 */
	 getName: function() {
	 	return this.name;
	 },

	/**
	 * @return {Integer} [description]
	 */
	 getPhotosCount: function() {
	 	if (this.photosCount == 0) {
	 		this.photosCount = this.photos.length;
	 	}

	 	return this.photosCount
	 },

	/**
	 * @param {Photo[]} photos [description]
	 */
	 setPhotos: function(photos) {
	 	this.photos = photos;
	 },

	/**
	 * @return {Photo[]} [description]
	 */
	 getPhotos: function() {
	 	return this.photos;
	 },

	/**
	 * @return {String} [description]
	 */
	 getCreatedAt: function() {
	 	return this.created_at;
	 },

	/**
	 * @return {Boolean} [description]
	 */
	 hasPhotos: function() {
	 	if (this.photos.length == 0) {
	 		return false;
	 	} else {
	 		return true;
	 	}
	 },

	 setCoverPhoto: function(photo) {
	 	this.coverPhoto = photo;
	 },

	 getCoverPhoto: function(){ 
	 	return this.coverPhoto;
	 }
	}


	/** Photo model */
	function Photo() {
		this.id = "";
		this.name =  "";
		this.commentsCount = 0;
		this.buyers = 0;
		this.prospectBuyers = 0;
		this.comments = [];
		this.url = "";
		this.albumId = "";
		this.albumName = "";
	}

	Photo.prototype  = {

		setAlbumName: function(name) {
			this.albumName = name;
		},

		getAlbumName: function() {
			return this.albumName;
		},

		setAlbumId: function(id) {
			this.albumId = id;
		},

		getAlbumId: function() {
			return this.albumId;
		},

		setId: function(id) {
			this.id = id;
		},

		getId: function() {
			return this.id;
		},

	/**
	 * @param {String} name [description]
	 */
	 setName: function(name) {
	 	this.name = name;
	 },

	 getName: function() {
	 	return this.name;
	 },

	/**
	 * @param {Comment[]} comments [description]
	 */
	 setComments: function(comments) {
	 	this.comments = comments;
	 },

	 setComment: function(comment) {
	 	this.comments[this.comments.length] = comment;
	 },

	 getComment: function(index) {
	 	if (this.comments[index] !== undefined) {
		 	return this.comments[index];
	 	}

	 	return new Comment();
	 },

	/**
	 * @return {Comment[]} [description]
	 */
	 getComments: function() {
	 	return this.comments;
	 },	

	/**
	 * @param  {int} commentsCount [description]
	 * @return {int}               [description]
	 */
	 setCommentsCount: function(commentsCount) {
	 	this.commentsCount = commentsCount;
	 },

	/**
	 * @return {Integer} [description]
	 */
	 getCommentsCount: function() {
	 	if (this.commentsCount == 0 ) {
	 		this.commentsCount = this.comments.length;
	 	}

	 	return this.commentsCount;
	 },

	/**
	 * @return {Integer} [description]
	 */
	 getBuyersCount: function() {
	 	return this.buyers;
	 },

	/**
	 * @return {Integer} [description]
	 */
	 getProspectBuyersCount: function() {
	 	return this.prospectBuyers;
	 },

	/**
	 * @return {Boolean} [description]
	 */
	 hasComments: function() {
	 	if (commentsCount == 0) {
	 		return false;
	 	}

	 	return true;
	 },

	/**
	 * @return {Boolean} [description]
	 */
	 hasBuyers: function() {
	 	if (buyers == 0) {
	 		return false;
	 	}

	 	return true;
	 },

	/**
	 * @return {Boolean} [description]
	 */
	 hasProspectBuyers: function() {
	 	if (prospectBuyers == 0) {
	 		return false;
	 	}

	 	return true;
	 },

	 setUrl: function(url) {
	 	this.url = url;
	 }, 

	 getUrl: function() {
	 	return this.url;
	 }
	}



	/** Comment model */
	function Comment() {
		this.message = "";
		this.createdAt = "";
		this.replies = [];
		this.repliesCount = 0;
		this.author = "";
		this.authorAvatar = "";
		this.authorId = "";
		this.id = "";
	}

	Comment.prototype = {
		setId: function(id) {
			this.id  = id;
		},

		getId: function() {
			return this.id;
		},

	/**
	 * @param {String} message [description]
	 */
	 setMessage: function(message) {
	 	this.message = message;
	 },

	/**
	 * @return {String} [description]
	 */
	 getMessage: function() {
	 	return this.message;
	 },

	/**
	 * @param {String} createdAt [description]
	 */
	 setCreatedAt: function(createdAt) {
	 	this.createdAt = createdAt;
	 },

	/**
	 * @return {String} [description]
	 */
	 getCreatedAt: function() {
	 	return this.createdAt;
	 },

	/**
	 * @param {Comment[]} replies [description]
	 */
	 setReplies: function(replies) {
	 	this.replies = replies;
	 },


	/**
	 * @param  {Integer} index [description]
	 * @return {Comment}       [description]
	 */
	 getReply: function(index) {
	 	return this.replies[index];
	 },

	 getRepliesCount() {
	 	if (this.repliesCount == 0) {
	 		this.repliesCount = this.replies.length;
	 	}
	 	return this.repliesCount;
	 },

	/**
	 * @return {Comment[]} [description]
	 */
	 getReplies: function() {
	 	return this.replies;
	 },

	 setAuthor: function(author) {
	 	this.author = author;
	 },

	 getAuthor: function() {
	 	return this.author;
	 },

	 setAuthorAvatar: function(avatar) {
	 	this.authorAvatar = avatar;
	 },

	 getAuthorAvatar: function() {
	 	return this.authorAvatar;
	 },

	 setAuthorId: function(id) {
	 	this.authorId= id;
	 },

	 getAuthorId: function() {
	 	return this.authorId;
	 },

	}