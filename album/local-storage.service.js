(function(window){


	angular.module('services')
	.factory('LocalStorage', LocalStorage);

    LocalStorage.$inject = [];
    function LocalStorage() {
    	var localStorage = window.localStorage;
    	var PAGE_INFO_KEY = "pageInfo",
    	ALBUMS_LIST_KEY = "albums",
    	PHOTOS_KEY = "photos",
    	pageInfo;

    	return {
    		PAGE_INFO_KEY: PAGE_INFO_KEY,

    		putPageInfo: putPageInfo,

    		getPageInfo: getPageInfo,

    		putAlbums: putAlbums,

    		setAlbums: setAlbums,

    		getAlbums: getAlbums,

    		getAlbum: getAlbum,

    		putAlbum: putAlbum,

    		putPhotos: putPhotos,	

    		getPhotos: getPhotos,

    		getPhoto: getPhoto,

    		getPhotoDetails: getPhotoDetails,

    		addNewPhotoComment: addNewPhotoComment,

    		addNewPhotoCommentReply: addNewPhotoCommentReply,

    		putPhoto: putPhoto,

    		removePhoto: removePhoto,

    		putUserAccessToken: putUserAccessToken,

    		getUserAccessToken: getUserAccessToken,

    		putUserId: putUserId,

    		getUserId: getUserId,

    		putPageAccessToken: putPageAccessToken,

    		getPageAccessToken: getPageAccessToken,

    		getPageId: getPageId,

    		putPageId: putPageId,

    		cleanEverything: cleanEverything,
    	}

    	function cleanEverything() {
    		localStorage.clear();
    	}
    	
    	function putUserAccessToken(token) {
    		localStorage.setItem('user_access_token', token);
    	}

    	function getUserAccessToken() {
    		return localStorage.getItem('user_access_token');
    	}

    	function putUserId(id) {
    		localStorage.setItem('user_id', id);
    	}

    	function getUserId() {
    		return localStorage.getItem('user_id');
    	}

    	function putPageAccessToken(accessToken) {
    		console.log("puting access token", accessToken);
    		localStorage.setItem("page_access_token", accessToken);
    	}

    	function getPageAccessToken() {
    		var token = localStorage.getItem('page_access_token');
    		console.log('getting access token ', token)

    		return token;
    	}

    	function putPageId(pageId) {
    		console.log("pageId = ", pageId);
    		localStorage.setItem("page_id", pageId)
    	}

    	function getPageId() {
    		return localStorage.getItem('page_id');
    	}

    	function putAlbums(albums) { // albums = [{...}, {...}]
    		console.log("putAlbums", albums);
			// First put should be arrayed
			localStorage.setItem(ALBUMS_LIST_KEY, JSON.stringify(albums));
		}

		function putAlbum(album) {
			console.log("putAlbum()")
			console.log("putAlbum", album);
			cachedAlbums = getAlbums();
			var found = false;
			console.log("getAlbums", cachedAlbums);
			for (var i = 0; i < cachedAlbums.length; i++) {
				if (cachedAlbums[i].id == album.id) {
					console.log("already exist")
					console.log("before addition", cachedAlbums.length)
					// already exists, let update it;
					found = true;
					cachedAlbums[i] = album;
					console.log('after addition', cachedAlbums.length);
					break;
				}

			}

			if (found === false) {
				console.log("does not exist");
				console.log("before addition", cachedAlbums.length);
				// new, so we append to existing album list
				cachedAlbums.push(album);
				console.log('after addition', cachedAlbums.length);
			}
			putAlbums(cachedAlbums);
		}

		function getAlbums() {
			console.log("getAlbums()")
			albums =  JSON.parse(localStorage.getItem(ALBUMS_LIST_KEY))

			if (albums !==  null) {
				return albums;
			}

			return null;
		}

    	function getPageInfo() {
    		pageInfo = localStorage.getItem(PAGE_INFO_KEY);
    		return JSON.parse(pageInfo);
    	}

    	function setAlbums(albums) {
    		albums = JSON.stringify(albums);
    		localStorage.setItem(ALBUMS_LIST_KEY, albums);
    	}

    	// function getAlbums() {
    	// 	albums = localStorage.getItem(ALBUMS_LIST_KEY);

    	// 	return JSON.parse(albums);
    	// }

    	function getAlbum(albumId) {
    		console.log("getAlbum()")
    		albums = getAlbums();
    		console.log('albums', albums);
    		foundAlbum = null;
  			for (var i = 0; i < albums.length; i++) {
  				if (albums[i].id == albumId) {
  					console.log("album found")
  					foundAlbum = albums[i];
  					break;
  				}
  			}

  			return foundAlbum;
    	}

    	function putPhotos(albumId, photos) {
    		console.log("putPhotos()")
    		console.log("photos to save ", photos);
    		var savecachedData = JSON.stringify([{albumId: albumId, photos: photos}]);
    		if (localStorage.getItem(PHOTOS_KEY) === null) {
				// First put should be arrayed
				localStorage.setItem(PHOTOS_KEY, savecachedData);
			} else {
				// Let first check to see if photos for this albumId is already in local storage
				var exists = false;
				var cachedData = JSON.parse(localStorage.getItem(PHOTOS_KEY));
				var datum;
				for(var i = 0; i < cachedData.length; i++) {
					datum = cachedData[i];
					if (exists === true) {
						break;
					}

					if (datum.albumId == albumId) {
						// override existing cachedData with new cachedData
						console.log("existing cache found")
						exists = true;
						cachedData[i] = {albumId: albumId, photos: photos};
						localStorage.setItem(PHOTOS_KEY, JSON.stringify(cachedData));
					}
				}

				if (exists === false) {
					// None of the existing cache matches this new insertion, let append it to the cache list
					newDatum = {albumId: albumId, photos: photos};
					cachedData.push(newDatum)
					localStorage.setItem(PHOTOS_KEY, JSON.stringify(cachedData));
				}
			}
		}

		function getPhotoDetails(albumId, photoId) {
			console.log("Called", getPhotos(albumId));
			var photos = getPhotos(albumId)
			console.log("myphotos = ", photos)
			var found = false;
			var photo;

			for(var i = 0; i < photos.length; i++) {
				if (found === true) {
					break;
				}

				if (photos[i].id == photoId) {
					found = true;
					photo = photos[i]; // {comments: {data: [{...}, {...}]}}
				}
			}

			if (found) {
				console.log("Foudnd photo", photo);
				return photo
			}

			return null;
		}

		function removePhoto(photoId, albumId) {
			console.log("remoevPhoto()");
			var photos = getPhotos(albumId);

			for (var i = 0; i < photos.length; i++) {
				if (photos[i].id == photoId) {
					console.log("before removeal of photo", photos);
					photos.splice(i, 1);
					console.log("after removal of photo", photos);
					break;
				}
			}

			putPhotos(albumId, photos);
		}

		function putPhoto(photo, albumId) {
			var photos = getPhotos(albumId)
			var exists = false;

			for (var i = 0; i < photos.length; i++) {
				if (exists === true) {
					break;
				}

				if (photos[i].id == photo.id) {
					console.log("match found with index " + i)
					photos[i] = photo
					exists = true;
				}
			}

			if (exists === false)
				photos.push(photo)

			putPhotos(albumId, photos)
		}

		function putPageInfo(pageInfo) {
			pageInfo = JSON.stringify(pageInfo);
			localStorage.setItem(PAGE_INFO_KEY, pageInfo);
		}

		function getPhotos(albumId) {
			console.log("album ID : ", albumId);
			cachedData = JSON.parse(localStorage.getItem(PHOTOS_KEY));
			console.log("cachedData", cachedData)

			if (cachedData  === null) {
				return null;
			}

			var datum, photos = null;
			for(var i = 0; i < cachedData.length; i++) {
				console.log("loop index " + i)
				datum = cachedData[i];
				if (albumId == datum.albumId) {
					console.log("match found")
					photos = datum.photos;
					break;
				}
			}
			console.log('am here', photos)
			if (photos !== null) {
				console.log("not null")
				console.log("")
				if (photos.data !== undefined) {
					return photos.data;
				}

				// return photos;
			}

			return null
		}

		function getPhoto(photoId, albumId) {
			if (albumId === undefined) {
				throw "An album ID is needed when this  method is called";
			}

			if (photoId === undefined) {
				throw "A photo ID is needed when this method is called";
			}

			photos = getPhotos(albumId)
			isPhotoFound = false;
			var foundPhoto;
			for (var photo in photos) {
				if (photo.getId() == photoId) {
					isPhotoFound = true;
					foundPhoto = photo;
				}	
			}

			if (isPhotoFound === true) {
				return foundPhoto;
			}

			return null;
		}

		function addNewPhotoComment(comment, photoId, albumId) {
			console.log('addNewPhotoComment()')
			if (comment === undefined) {
				return false;
			}

			if (photoId === undefined) {
				throw "A photo ID is needed for this action";
			}

			if (albumId === undefined) {
				throw "An album ID is need for this action"
			}

			var photo = getPhotoDetails(albumId, photoId);
			console.log("again photo", photo)
			// Add new comment to the end of the comments list
			if (photo.comments !== undefined) {
				console.log("Before adding new comment, comments size = " + photo.comments.data.length);
				photo.comments.data.splice(photo.comments.data.length, 0, comment)
				console.log("After adding new comment, comments size = " + photo.comments.data.length);
			} else {
				photo['comments'] = {
					data: [comment]
				}
			}
			console.log("photo.comments", photo.comments);
			putPhoto(photo, albumId)
		}

		function addNewPhotoCommentReply(comment, commentId, photoId, albumId) {
			console.log("addNewPhotoCommentReply")
			if (comment == undefined) {
				return false;
			}

			if (photoId === undefined) {
				throw "A photo ID is needed for this action";
			}

			if (albumId === undefined) {
				throw "An album ID is need for this action"
			}

			var photo = getPhotoDetails(albumId, photoId);
			console.log("photoFelix", photo);
			for (var i = 0; i < photo.comments.data.length; i++) {
				if (commentId == photo.comments.data[i].id) {
					console.log("comment found")
					if (photo.comments.data[i].comments !== undefined && photo.comments.data[i].comments.data.length > 0) {
						console.log("exist comment replies")
						console.log("before reply addd " + photo.comments.data[i].comments.data.length)
						// comment has some replies
						var repliesLength = photo.comments.data[i].comments.data.length
						photo.comments.data[i].comments.data.splice(repliesLength, 0, comment)
						console.log("after reply addd " + photo.comments.data[i].comments.data.length)

					} else {
						console.log("no comment replies, so we add it as first")
						// no comment replies exists, so we add this comment as the first reply comment
						photo.comments.data[i].comments = {
							"data": [comment]
						}
						console.log("after reply addd " + photo.comments.data[i].comments.data.length)
					}
					console.log("photo state after adding reply comment", photo)
					break;
				}
			}
			putPhoto(photo, albumId)
		}
	}
})(window);