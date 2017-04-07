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
		var FACEBOOK_ACCESS_TOKEN_URL = "https://www.facebook.com/v2.8/dialog/oauth/access_token?client_id=" 
		+ APP_ID 
		+ "&redirect_uri=" + CALLBACK_URL 
		+ "&client_secret=" + APP_SECRET;
		return {
			authenticate: authenticate,
			fetchAccessToken: fetchAccessToken,
		};


		function authenticate() {
			console.log("authenticating facebook");
			window.location.replace(FACEBOOK_OAUTH_URL);
		}

		function fetchAccessToken(code) {
			console.log("fetcing access token");
			var url = FACEBOOK_ACCESS_TOKEN_URL + "&code=" + code;
			console.log("url", url);
			$http.jsonp(FACEBOOK_ACCESS_TOKEN_URL).then(function(data){
				console.log("success data", data);
			}, function(data) {
				console.log("fail data", data);
			})
		}
	}

	FacebookService.$inject = ['$resource']
	function FacebookService($resource) {

		var PAGE = "1543025389059770";
		var ACCESS_TOKEN =  "EAACEdEose0cBAEoZBbxtBufVk1SFt1TZCAbH8XsDYCAMDS2S19hMyohBJyZAUhLtGUnuYdLK9pmz0wZCr2CleWkhEeweVd0dWvBdUU06Y5JpT0qH5wAmnEdks4r6R1WxNR5IUBLUW3vGnXLPZCGv9QEpksJfbOVj9MYZAHJnewK5Pd1qTrjmt4a3DT6LkhQkgZD";
		var FACEBOOK_BASE_URL = "https://graph.facebook.com/v2.8/";
		var BASE_URL =  FACEBOOK_BASE_URL +  PAGE + "?access_token=" + ACCESS_TOKEN + "&";
		var PAGE_INFO_URL = BASE_URL + "fields=username,picture,name";
		
		var ALBUMS_NEW_URL = FACEBOOK_BASE_URL + PAGE + "/albums?access_token=" + ACCESS_TOKEN;
		var PHOTOS_NEW_URL = FACEBOOK_BASE_URL + PAGE + "/photos?access_token=" + ACCESS_TOKEN;
		var ALBUMS_URL = BASE_URL + "fields=albums{name, cover_photo{images}, count}";
		var ALBUM_DELETE_URL = FACEBOOK_BASE_URL + ":albumId?access_token=" + ACCESS_TOKEN;

		var PAGE_PHOTOS_URL = FACEBOOK_BASE_URL + ":albumId/photos?fields=name,source,album,comments{created_time,message,from{picture,name},comments{created_time,message,from{picture,name}}}" + "&access_token=" + ACCESS_TOKEN;
		var PAGE_PHOTO_COMMENTS_URL = PHOTOS_NEW_URL + ":photoId/comments?fields=message,from{picture,name},created_at" + "&access_token=" + ACCESS_TOKEN;
		var customActions = {
			getPageInfo: {
				url: PAGE_INFO_URL,
				method: "GET",
			},
			
			getAlbums: {
				url: ALBUMS_URL,
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
				url: FACEBOOK_BASE_URL + ":albumId/photos?access_token=" + ACCESS_TOKEN,
				method: "POST",
				headers: {'Content-Type': 'multipart/form-data'}
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
				url: FACEBOOK_BASE_URL + ":photoId/comments?access_token=" + ACCESS_TOKEN,
				method: "POST", 
			},

			getComment: {
				url: FACEBOOK_BASE_URL + ":commentId?access_token=" + ACCESS_TOKEN,
				method: "GET",
			}
		}
		return $resource(FACEBOOK_BASE_URL, null, customActions);
	}
})();