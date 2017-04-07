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

    		getAlbums: getAlbums,

    		putPhotos: putPhotos,	

    		getPhotos: getPhotos,

    		getPhoto: getPhoto,

    		getPhotoDetails: getPhotoDetails,
    	}

    	function getPageInfo() {
    		pageInfo = localStorage.getItem(PAGE_INFO_KEY);
    		return JSON.parse(pageInfo);
    	}

    	function getAlbums(albums) {
    		albums = JSON.stringify(albums);
    		localStorage.setItem(ALBUMS_LIST_KEY, albums);
    	}

    	function getAlbums() {
    		albums = localStorage.getItem(ALBUMS_LIST_KEY);

    		return JSON.parse(albums);
    	}

    	function putPhotos(albumId, photos) {
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
						exists = true;
						cachedData[i] = {albumId: albumId, photos: photos};
						localStorage.setItem(PHOTOS_KEY, JSON.stringify(cachedData));
					}
				}

				if (exists === false) {
					// None of the existing cache matches this new insertion, let append it to the cache list
					datum = {albumId: albumId, photos: photos};
					cachedData[cachedData.length] = datum;
					localStorage.setItem(PHOTOS_KEY, JSON.stringify(cachedData));
				}
			}
		}

		function getPhotoDetails(albumId, photoId) {
			console.log("Called", getPhotos(albumId));
			var photos = getPhotos(albumId).data;
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

		function putPageInfo(pageInfo) {
			pageInfo = JSON.stringify(pageInfo);
			localStorage.setItem(PAGE_INFO_KEY, pageInfo);
		}

		function getPhotos(albumId) {
			console.log("album ID : ", albumId);
			cachedData = JSON.parse(localStorage.getItem(PHOTOS_KEY));

			if (cachedData  === null) {
				return null;
			}

			var datum, photos = null;
			for(var i = 0; i < cachedData.length; i++) {
				datum = cachedData[i];
				if (albumId == datum.albumId) {
					photos = datum.photos;
					break;
				}
			}

			return photos;
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
	}
})(window);