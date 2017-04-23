angular.module('album')

.controller("PhotosController", PhotosController);

PhotosController.$inject = ['photos', 'album', 'FacebookService', 'LocalStorage'];
function PhotosController(photos, album, FacebookService, LocalStorage) {
	var vm = this;
	vm.photos = photos;
	console.log("photos", vm.photos)
	console.log("album", album);	
	vm.album = album;
	vm.deletePhoto = deletePhoto;
	vm.deleteAlbum = deleteAlbum;
	vm.deletePhoto = deletePhoto;

	function deletePhoto(photoId) {
		console.log('delete photo with ID ' + photoId);
		FacebookService.deletePhoto({photoId: photoId}, null, function(response) {
			console.log("delete photo response", response);
			for (var i = 0; i < vm.photos.length; i++) {
				console.log("loop")
				if (vm.photos[i].getId() == photoId) {
					console.log("found");
					LocalStorage.removePhoto(photoId, vm.album.getId());
					vm.photos.splice(i, 1);
					console.log("albumId", album.getId())
					break;
				}
			}
		}, function(response) {
			console.log("delete photo failed response", response);
		});
	}


	function deleteAlbum() {
		// NOTE: Can't delete albums using the Facebook Graph API
		console.log('deleting photo album with ID ' + vm.photos[0].getAlbumId())
	}
}