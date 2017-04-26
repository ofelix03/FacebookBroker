(function(){
	angular.module('services')
	.factory('FacebookAuthenticator', FacebookAuthenticator)

	.factory('FacebookService', FacebookService);

	FacebookAuthenticator.$inject = ['$http']
	function FacebookAuthenticator($http, $sce) {
		var APP_ID = "1028957697237370";
		var APP_SECRET = "fa3e3378eb1528743144d1a8b9b86c81";
		var CALLBACK_URL = encodeURIComponent("http://192.168.121.86:3000/#!/oauth");
		var FACEBOOK_OAUTH_URL = "https://www.facebook.com/v2.8/dialog/oauth?client_id=" + APP_ID + "&redirect_uri=" + CALLBACK_URL;
		// var FACEBOOK_ACCESS_TOKEN_URL = "https://www.facebook.com/v2.8/dialog/oauth/acce?client_id=" 
		+ APP_ID 
		+ "&redirect_uri=" + CALLBACK_URL 
		+ "&client_secret=" + APP_SECRET;
		return {
			isConnected: isConnected,
			login: login,
		};


		function isConnected(responseCallback) {
			FB.getLoginStatus(responseCallback);
		}

		function login() {
			FB.login(function(response) {
				if (response.status == "connected") {
					return response.authResponse;
				}
				return false;
			},  {
				scope: 'publish_actions,publish_pages,manage_pages', 
				return_scopes: true
			});
		}
	}

	FacebookService.$inject = ['$resource', 'LocalStorage']
	function FacebookService($resource, LocalStorage) {

		var PAGE = LocalStorage.getPageId();
		var FACEBOOK_BASE_URL = "https://graph.facebook.com/v2.8/";
		var BASE_URL =  FACEBOOK_BASE_URL +  ":pageId?";
		var PAGE_INFO_URL = BASE_URL + "fields=username,picture,name";
		
		var ALBUMS_NEW_URL = FACEBOOK_BASE_URL + ":pageId/albums";
		var PHOTOS_NEW_URL = FACEBOOK_BASE_URL + ":pageId/photos";
		var ALBUMS_URL = BASE_URL + "fields=albums{name,description,cover_photo{images.limit(1)},count}";
		var ALBUM_URL = FACEBOOK_BASE_URL + ":albumId?fields=name,description,cover_photo{images.limit(1)},count";
		var ALBUM_DELETE_URL = FACEBOOK_BASE_URL + ":albumId";

		var PAGE_PHOTOS_URL = FACEBOOK_BASE_URL + ":albumId/photos?fields=name,source,album{id,name,created_time,cover_photo{images.limit(1)},count},comments{created_time,message,from{picture,name},comments{created_time,message,from{picture,name}}}";
		var PAGE_PHOTO_URL = FACEBOOK_BASE_URL + ":albumId/:photoId?fields=name,source,album{id,name,created_time,cover_photo},comments{created_time,message,from{picture,name},comments{created_time,message,from{picture,name}}}";
		var PAGE_PHOTO_COMMENTS_URL = PHOTOS_NEW_URL + ":photoId/comments?fields=message,from{picture,name},created_at";
		var ACCOUNTS_URL = FACEBOOK_BASE_URL + "me/accounts";

		var customActions = {
			getAccounts: {
				url: ACCOUNTS_URL,
				method: "GET",
			},

			getPageInfo: {
				url: PAGE_INFO_URL,
				method: "GET",
			},
			
			getAlbums: {
				url: ALBUMS_URL,
				method: "GET",
			},

			getAlbum: {
				url: ALBUM_URL,
				method: "GET",
			},

			deleteAlbum: {
				url: ALBUM_DELETE_URL,
				method: "DELETE",
			},

			publishNewAlbum: {
				url: ALBUMS_NEW_URL,
				method: "POST",
			},

			publishNewPhotos: {
				url: "https://graph.facebook.com",
				method: "POST",
				isArray:true,
				headers: { 'Content-Type': undefined }
			},

			publishNewPhoto: {
				url: FACEBOOK_BASE_URL + ":albumId/photos",
				method: "POST",
				headers: {'Content-Type': undefined}
			},


			getPhotos: {
				url: PAGE_PHOTOS_URL,
				method: "GET",
			},

			getPhotoComments: {
				url: PAGE_PHOTO_COMMENTS_URL,
				method: "GET",
			},

			publishComment: {
				url: FACEBOOK_BASE_URL + ":photoId/comments",
				method: "POST", 
			},

			getComment: {
				url: FACEBOOK_BASE_URL + ":commentId?fields=created_time,message,from{picture,name}",
				method: "GET",
			},

			publishCommentReply: {
				url: FACEBOOK_BASE_URL + ":commentId/comments",
				method: "POST",
			},

			getCommentReply: {
				url: FACEBOOK_BASE_URL + ":commentId/comments/:replyId?fields=created_time,message,from{picture,name}",
				method: "GET",
			},

			deletePhoto: {
				url: FACEBOOK_BASE_URL + ":photoId",
				method: "DELETE",
			}

		}
		return $resource(FACEBOOK_BASE_URL, null, customActions);
	}
})();