angular.module("album")
.controller("NewAlbumController", NewAlbumController);

NewAlbumController.$inject = ['$scope', 'FacebookService', 'LocalStorage'];
function NewAlbumController($scope, FacebookService, LocalStorage) {
	vm = this
	vm.album = {
		name: "",
		description: "",
		photos: [],
	};

	vm.isNewAlbum = true;

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
			pageId: LocalStorage.getPageId(),
			access_token: LocalStorage.getPageAccessToken(),
		}	

		vm.isPublishing = true;

		FacebookService.publishNewAlbum(params, null, function(data){
			console.log("positive reponse", data);
			if (data.id !== null) {
				var albumId = data.id;
				// Go ahead and publish the photos
				uploadedPhotos = album.photos.length
				for (var i = 0; i < album.photos.length; i++) {
					photo = dataURItoBlob(album.photos[i])
					var fd = new FormData();
					fd.append('source', photo);
					FacebookService.publishNewPhoto({albumId: albumId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, fd, function(data){
						uploadedPhotos -= 1
						if (uploadedPhotos == 0) {
							console.log("fetch fotos with album id " + albumId);
							FacebookService.getPhotos({albumId: albumId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, null, function(response) {
								console.log("positive response", response);
								var photos = {
									data: response.data,
								};
								console.log("photos data", photos);
								LocalStorage.putPhotos(albumId, photos);
								console.log("album info", response.data[0].album);
								LocalStorage.putAlbum(response.data[0].album);
							}, function(response) {
								console.log("fail response", response);
							});
							vm.showPublishSuccessFeedback()
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
			} else {
				console.log("No album id")
			}
		}, function(data){
			console.log("fail response", data);
		});
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