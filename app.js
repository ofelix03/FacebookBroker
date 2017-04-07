angular.module('services', []);
angular.module('facebookBrokerApp', [
	'ui.router',
	'login',
	'album',
	'services',
	'ngResource',
	])

.config(function($stateProvider, $urlRouterProvider, $httpProvider){
	$urlRouterProvider.otherwise('login');

	$stateProvider
	.state("app", {
		url: '/oauth',
		controller: "AppController",
		templateUrl: "app.html",
		controllerAs: "vm",
		resolve: {
			pageInfo: function($q, FacebookService, LocalStorage) {
				var deferred = $q.defer();	
				var page, response;
				if (LocalStorage.getPageInfo() !== null) {
					console.log("has page info");
					// Let's use cached data
					response = LocalStorage.getPageInfo();
					page = parseToPageObject(response);
					deferred.resolve(page);
				} else {
					console.log("has no page info");
					// Let's get data over the wire
					FacebookService.getPageInfo(null, function(response) {
						console.log('response is', response);
						LocalStorage.putPageInfo(response);
						page = parseToPageObject(response);
						deferred.resolve(page);
					});
				}

				return deferred.promise;

				function parseToPageObject(response) {
					var page = new Page();
					page.setName(response.name);
					page.setUsername(response.username);
					page.setCover(response.picture.data.url);

					return page;
				}
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "/login/login.html",
		controllerAs: "vm",
		controller: "LoginController",
	})

	.state('app.felix', {
		url: "^/felix",
		template: "<h1>Hello there</h1>",
	})
	.state('app.albums', {
		url: "^/albums",
		template: "<h1>Hello there</h1>"
		// templateUrl: "album/album.html",
		// controllerAs: "vm",
		// controller: "AlbumController",
		// resolve: {
		// 	pageAlbums: function(FacebookService, $q, LocalStorage) {
		// 		var deferred = $q.defer();
		// 		var response, albums;
		// 		if (LocalStorage.getAlbums() !== null) {
		// 			// Let's use data in cache
		// 			console.log("has albums in storage");
		// 			response = LocalStorage.getAlbums();
		// 			console.log("albums parsed", response);
		// 			albums = parseIntoAlbumObject(response);
		// 			deferred.resolve(albums);
		// 		} else {
		// 			// Let's get data over the wire
		// 			FacebookService.getAlbums(null, function(response){
		// 				LocalStorage.putAlbums(response);
		// 				console.log('page albums', response);
		// 				albums = parseIntoAlbumObject(response);

		// 				deferred.resolve(albums);
		// 			});
		// 		}

		// 		return deferred.promise;

		// 		function parseIntoAlbumObject(response) {
		// 			var albums = [], album, photoObject;
		// 			var albumsArray = response.albums.data;
		// 			for(var i = 0; i < albumsArray.length; i++) {
		// 				albumObject = albumsArray[i];
		// 				album = new Album();
		// 				album.setId(albumObject.id);
		// 				album.setName(albumObject.name);	
		// 				album.setPhotosCount(albumObject.count);
		// 				if (albumObject.cover_photo !== undefined) {
		// 					album.setCoverPhoto(albumObject.cover_photo.images[0].source);
		// 				}

		// 				albums[albums.length] = album;
		// 			}

		// 			return albums;
		// 		}
		// 	}
		// }
	})

	.state('app.photos', {
		url: "^/albums/:albumId/photos",
		templateUrl: "/album/photos.html",
		controllerAs: "vm",
		controller: "PhotosController",
		resolve: {
			photos: function($stateParams, FacebookService, $q, LocalStorage) {
				var deferred = $q.defer();
				if (LocalStorage.getPhotos($stateParams.albumId) !== null) {
					console.log("Using photos from cached response");
					var photos = [], photoObject, photo, photosArray;
					
					var response = LocalStorage.getPhotos($stateParams.albumId);
					var photos = [], photoObject, photo, photosArray;
					photosArray = response.data;
					for(var i = 0; i < photosArray.length; i++) {
						photoObject = photosArray[i];
						photo = ModelParserUtil.parseToPhotoObject(photoObject);

						if (photoObject.comments !== undefined) {
							var comments = [], comment, commentObject, commentsArray;
							commentsArray = photosArray[i].comments.data;	
								// console.log("index : " + i + "commments = " + commentsArray.length);
								for(var j = 0; j < commentsArray.length; j++) {
									commentObject = commentsArray[j];
									comment = ModelParserUtil.parseToCommentObject(commentObject);

									if(commentObject.comments !== undefined) {
										var repliesArray = commentObject.comments.data;
										// console.log("repliesCount = " + repliesArray.length);
										var reply, replyObject, replies = [];

										for(var k = 0; k < repliesArray.length; k++) {
											// console.log("photo index = " + i + ", comment index = " + j + ", reply index = " + k);
											replyObject = repliesArray[k];
											replies[k] = ModelParserUtil.parseToCommentObject(replyObject);
										}
										comment.setReplies(replies);
										// console.log("myReplies index " + j + " == ", replies);
									}
									comments[j] = comment;
								}
								photo.setComments(comments);
								photo.setCommentsCount(comments.length);
								// console.log("photoModel", photo);
							}						
							photos[i] = photo;
						}		
						deferred.resolve(photos);
					} else {
						console.log("fetchign new data over the wire");
						FacebookService.getPhotos({albumId: $stateParams.albumId}, function(response) {
							console.log("freshResponse", response);
							LocalStorage.putPhotos($stateParams.albumId, response);

							var photos = [], photoObject, photo, photosArray;
							photosArray = response.data;
							for(var i = 0; i < photosArray.length; i++) {
								photoObject = photosArray[i];
								photo = ModelParserUtil.parseToPhotoObject(photoObject);

								if (photoObject.comments !== undefined) {
									var comments = [], comment, commentObject, commentsArray;
									commentsArray = photosArray[i].comments.data;	
								// console.log("index : " + i + "commments = " + commentsArray.length);
								for(var j = 0; j < commentsArray.length; j++) {
									commentObject = commentsArray[j];
									comment = ModelParserUtil.parseToCommentObject(commentObject);

									if(commentObject.comments !== undefined) {
										var repliesArray = commentObject.comments.data;
										// console.log("repliesCount = " + repliesArray.length);
										var reply, replyObject, replies = [];

										for(var k = 0; k < repliesArray.length; k++) {
											// console.log("photo index = " + i + ", comment index = " + j + ", reply index = " + k);
											replyObject = repliesArray[k];
											replies[k] = ModelParserUtil.parseToCommentObject(replyObject);
										}
										comment.setReplies(replies);
										// console.log("myReplies index " + j + " == ", replies);
									}
									comments[j] = comment;
								}
								photo.setComments(comments);
								photo.setCommentsCount(comments.length);
								// console.log("photoModel", photo);
							}						
							photos[i] = photo;
						}	
						// console.log("photosWorld", photos);	
						deferred.resolve(photos);
					});
					}
					return deferred.promise;
				}
			}
		})

	.state('app.photoDetails', {
		url: "^/albums/:albumId/photos/:photoId",
		templateUrl: "/album/photo-details.html",
		controllerAs: "vm",
		controller: 'PhotoDetailsController',
		resolve: {
			photoDetails: function($stateParams, $q, LocalStorage) {
				var deferred = $q.defer();
				if (LocalStorage.getPhotos($stateParams.albumId) !== null) {
					console.log("exists");
					var response = LocalStorage.getPhotoDetails($stateParams.albumId, $stateParams.photoId);
					// console.log("myFelix", response);

					var photos = [], photoObject, photo;
					photoObject = response;
					// console.log("ourPHOtoObject", photoObject);
					photo = ModelParserUtil.parseToPhotoObject(photoObject);

					if (photoObject.comments !== undefined) {
						var commentsArray = photoObject.comments.data;
						var commentObject, comments = [];
						for(var i = 0; i < commentsArray.length; i++) {
							commentObject = commentsArray[i];
							comments[i] = ModelParserUtil.parseToCommentObject(commentObject);
							// Let's parse comment's replies
							if (commentObject.comments !== undefined) {
								var repliesArray = [], replyObject, reply; replies = [];
								repliesArray = commentObject.comments.data;
								for(var j = 0; j < repliesArray.length; j++) {
									replyObject = repliesArray[j];
									replies[j] = ModelParserUtil.parseToCommentObject(replyObject);
								}
								comments[i].setReplies(replies);
							}
							photo.setComments(comments);
						}
					}
					deferred.resolve(photo);
				}
				return deferred.promise;
			}
		}
	})

	.state('app.newphoto', {
		url: "^/albums/new",
		templateUrl: "album/new-album.html",
		controllerAs: "vm",
		controller: "NewAlbumController",
	});

});
