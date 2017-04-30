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
			// authenticate: function($state, FacebookAuthenticator, LocalStorage) {
			// 	console.log("LocalStorage.egtPageAccessToken()", LocalStorage.getPageAccessToken());
			// 	if (LocalStorage.getPageAccessToken() === null) {
			// 		$state.go("login");
			// 	} else {
			// 		console.log('not null');
			// 	}
			// },
			pageInfo: function($q, FacebookService, LocalStorage) {
				var deferred = $q.defer();	
				var page, response;
				var pageInfo = LocalStorage.getPageInfo();
				if (pageInfo !== null) {
					console.log("has page info");
					page = parseToPageObject(pageInfo);
					deferred.resolve(page);
				} else {
					console.log("has no page info");
					// Let's get data over the wire
					FacebookService.getPageInfo({pageId: LocalStorage.getPageId(), access_token: LocalStorage.getPageAccessToken()}, function(response) {
						console.log('response is', response);
						LocalStorage.putPageInfo(response);
						page = ModelParserUtil.parseToPageObject(response);
						deferred.resolve(page);
					});
				}
				return deferred.promise;
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "/login/login.html",
		controllerAs: "vm",
		controller: "LoginController",
	})

	.state('selectPage', {
		url: '^/select-page',
		templateUrl: 'login/pages.html',
		controllerAs: 'vm',
		controller: 'PageSelectionController',
	})

	.state('app.albums', {
		url: "^/albums",
		templateUrl: "album/album.html",
		controllerAs: "vm",
		controller: "AlbumController",
		resolve: {
			pageAlbums: function(FacebookService, $q, LocalStorage) {
				var deferred = $q.defer();
				var response, albums;
				if (LocalStorage.getAlbums() !== null) {
					// Let's use data in cache
					console.log("has albums in storage");
					response = LocalStorage.getAlbums();
					console.log("albums parsed", response);
					albums = [];
					for (var i = 0; i < response.length; i++) {
						albums.push(ModelParserUtil.parseToAlbumObject(response[i]));
					}
					deferred.resolve(albums)
				} else {
					// Let's get data over the wire
					FacebookService.getAlbums({pageId: LocalStorage.getPageId(), access_token: LocalStorage.getPageAccessToken()}, function(response){
						console.log("albums response", response);
						albums = [];
						if (response.albums !== undefined) {
							LocalStorage.putAlbums(response.albums.data);
							console.log('page albums', response);
							for (var i = 0; i < response.albums.data.length; i++) {
								albums.push(ModelParserUtil.parseToAlbumObject(response.albums.data[i]));
							}
						}
						deferred.resolve(albums);
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
					var photos = [], photoObject, photo;
					photoObject = response;
					photo = ModelParserUtil.parseToPhotoObject(photoObject);
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
	})

	.state('app.newAlbumPhoto', {
		url: "^/albums/:albumId/new",
		templateUrl: "album/new-album.html",
		controllerAs: "vm",
		controller: "AddNewAlbumPhotoController",
		resolve: {
			album: function(LocalStorage, $stateParams) {
				console.log("$stateParams", $stateParams);
				album = LocalStorage.getAlbum($stateParams.albumId)
				console.log("myalbum", album)
				album = ModelParserUtil.parseToAlbumObject(album)
				console.log('album', album)
				return album;
			}
		}
	})

	.state('app.photos', {
		url: "^/albums/:albumId/photos",
		templateUrl: "/album/photos.html",
		controllerAs: "vm",
		controller: "PhotosController",
		resolve: {
			album: function($stateParams, FacebookService, LocalStorage, $q) {
				var deferred = $q.defer();
				var album = LocalStorage.getAlbum($stateParams.albumId);	
				if (album !== null) {
					console.log("felix album", album);
					var albumModel = ModelParserUtil.parseToAlbumObject(album);
					console.log("album model", albumModel); 
					deferred.resolve(albumModel);
				} else {
					console.log("getting album fresh from wire");
					FacebookService.getAlbum({albumId: $stateParams.albumId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, null, function(response) {
						console.log("albumDataResponse", response);
						LocalStorage.putAlb
					}, function(response){
						console.log("AlbumDataResponseFailed", response);
					});
				}
				return deferred.promise;
			},
			photos: function($stateParams, FacebookService, $q, LocalStorage) {
				var deferred = $q.defer();
				if (LocalStorage.getPhotos($stateParams.albumId) !== null) {
					console.log("me")
					console.log("Using photos from cached response");
					var photos = [], photoObject, photo, photosArray;
					var response = LocalStorage.getPhotos($stateParams.albumId);
					console.log("response", response)
					var photos = [], photoObject, photo, photosArray;
					photosArray = response
					console.log("photoArray ", photosArray)
					console.log("photosArrayLength", photosArray.length)
					for(var i = 0; i < photosArray.length; i++) {
						photoObject = photosArray[i];
						console.log("object", photoObject)
						photo = ModelParserUtil.parseToPhotoObject(photoObject);
						console.log("photo", photo)
						if (photoObject.comments !== undefined) {
							var comments = [], comment, commentObject, commentsArray;
							commentsArray = photosArray[i].comments.data;	
							for(var j = 0; j < commentsArray.length; j++) {
								commentObject = commentsArray[j];
								comment = ModelParserUtil.parseToCommentObject(commentObject);

								if(commentObject.comments !== undefined) {
									var repliesArray = commentObject.comments.data;
									var reply, replyObject, replies = [];

									for(var k = 0; k < repliesArray.length; k++) {
										replyObject = repliesArray[k];
										replies[k] = ModelParserUtil.parseToCommentObject(replyObject);
									}
									comment.setReplies(replies);
								}
								comments[j] = comment;
							}
							photo.setComments(comments);
							photo.setCommentsCount(comments.length);
						}			
						photos[i] = photo;
					}		
					console.log("photos", photos)
					deferred.resolve(photos);
				} else {
					console.log("fetchign new data over the wire");
					FacebookService.getPhotos({albumId: $stateParams.albumId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, function(response) {
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
								for(var j = 0; j < commentsArray.length; j++) {
									commentObject = commentsArray[j];
									comment = ModelParserUtil.parseToCommentObject(commentObject);

									if(commentObject.comments !== undefined) {
										var repliesArray = commentObject.comments.data;
										var reply, replyObject, replies = [];

										for(var k = 0; k < repliesArray.length; k++) {
											replyObject = repliesArray[k];
											replies[k] = ModelParserUtil.parseToCommentObject(replyObject);
										}
										comment.setReplies(replies);
									}
									comments[j] = comment;
								}
								photo.setComments(comments);
								photo.setCommentsCount(comments.length);
							}						
							photos[i] = photo;
						}	
						deferred.resolve(photos);
					}, function(response) {
						console.log("getPhotos response failed");
					});
				}
				return deferred.promise;
			}
		}
	})

})

.run(function($rootScope, $state, LocalStorage) {
	// $rootScope = {
	// 	USER_ACCESS_TOKEN: null,
	// 	USER_ID: null,
	// 	isLoggedIn: false
	// }
	// 
	$rootScope.pageInfo = {
		USER_ID: LocalStorage.getUserId() || null,
		USER_ACCESS_TOKEN: LocalStorage.getUserAccessToken() || null,
		PAGE_ACCESS_TOKEN: LocalStorage.getPageAccessToken() || null,
		PAGE_ID: LocalStorage.getPageId() || null,
	};

	$rootScope.logout = function() {
		LocalStorage.cleanEverything();

		// @todo FacebookAuthenticator.logout(function(resposne) {
		//  $stage.go("login")
		// })
		// 
		$state.go("login");
	};


	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){ 
		console.log("toState", toState)
		console.log("pageINfo", $rootScope.pageInfo)
		console.log("from local storage", LocalStorage.getPageAccessToken());
		if (toState.name.indexOf("app") >= 0) {
			// event.preventDefault();
			if ($rootScope.pageInfo.PAGE_ACCESS_TOKEN === null) {
				console.log("routing to login page");
				$state.go('login');
				event.preventDefault();
			} 
		}

		if (toState.name.indexOf("selectPage") >= 0) {
			if ($rootScope.pageInfo.USER_ACCESS_TOKEN === null) {
				console.log("routing back to login page");
				$state.go("login");
				event.preventDefault();
			}
		}
	})



})
