(function(){
	angular.module("album")

	.controller("AlbumController", AlbumController);

	AlbumController.$inject = ['$rootScope', 'pageAlbums'];
	function AlbumController($rootScope, pageAlbums) {
		console.log("pageAlbums", pageAlbums);
		this.albums  = pageAlbums;
	}
})();