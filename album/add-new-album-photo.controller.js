angular.module("album")
.controller("AddNewAlbumPhotoController", AddNewAlbumPhotoController);

AddNewAlbumPhotoController.$inject = ['$scope', 'FacebookService', 'LocalStorage','album'];
function AddNewAlbumPhotoController($scope, FacebookService, LocalStorage, album) {
	// console.log("addAlbume", album);
	console.log("addnewalbum", album)
	vm = this
	vm.album = {
		id: album.getId(),
		name: album.getName(),
		description: album.getDescription(),
		photos: [],
	};

	vm.isNewAlbum = false;

	vm.isPublishing = false;
	vm.isPublished = false;
	vm.isPublishedFailed = false;
	vm.hidePublishSuccessFeedback = hidePublishSuccessFeedback;
	vm.showPublishSuccessFeedback = showPublishSuccessFeedback
	vm.hidePublishFailFeedback = hidePublishFailFeedback
	vm.showPublishFailFeedback = showPublishFailFeedback

	vm.publish = publish;
	vm.deletePhoto = deletePhoto;

	/** Functions */
	function publish(album) {
		vm.album = album;
		var params = {
			name: album.name,
			description: album.description,
		}	

		vm.isPublishing = true;

		// Go ahead and publish the photos
		uploadedPhotos = album.photos.length
		for (var i = 0; i < album.photos.length; i++) {
			photo = dataURItoBlob(album.photos[i])

			var fd = new FormData();
			fd.append('source', photo);
			FacebookService.publishNewPhoto({albumId: vm.album.id, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, fd, function(data){
				console.log("created photo", data);
				uploadedPhotos -= 1
				if (uploadedPhotos == 0) {
					vm.showPublishSuccessFeedback();
					FacebookService.getPhotos({albumId: vm.album.id, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, null, function(response) {
						console.log("photos response", response)
						var photos = {"data": response.data}
						// console.log("myAlbum", photos[0].album);
						// LocalStorage.putAlbum(photos[0].album);
						console.log("fotos", photos);
						var album = photos.data[0].album;
						console.log("album", album);
						LocalStorage.putAlbum(album);
						console.log('album data', album);
						LocalStorage.putPhotos(vm.album.id, photos);
					}, function(response) {
						console.log("photos repsonse failed ", response);
					});
				} else {
					console.log("UPloaded photos is > 0")
				}
			}, function(data){
				vm.showPublishFailFeedback()
			});
		}

		function dataURItoBlob(dataURI) {
			var byteString = atob(dataURI.split(',')[1]);
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
				return new Blob([ab], { type: 'image/jpeg' });
		}
	}

	function deletePhoto(index) {
		console.log("deleting photo with index of " + index);
		vm.album.photos.splice(index, 1);
	}

	function hidePublishSuccessFeedback() {
		console.log("hidePublishSuccess")
		vm.isPublished = false;
	}

	function showPublishSuccessFeedback() {
		vm.isPublished = true;
		vm.isPublishing = false;
	}

	function hidePublishFailFeedback() {
		vm.isPublishedFailed = false;
	}

	function showPublishFailFeedback() {
		vm.isPublishedFailed = true;
	}

	
}