angular.module('album')

.controller("PhotosController", PhotosController);

PhotosController.$inject = ['photos', 'FacebookService'];
function PhotosController(photos, FacebookService) {
	this.photos = photos;
	
	this.deletePhoto = deletePhoto;
	this.deleteAlbum = deleteAlbum;
	this.deletePhoto = deletePhoto;

	function deletePhoto(photoId) {
		console.log('delete photo with ID ' + photoId);
	}

	function deleteAlbum() {
		// NOTE: Can't delete albums using the Facebook Graph API
		console.log('deleting photo album with ID ' + this.photos[0].getAlbumId())
	}
}