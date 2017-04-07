(function(){
	'use strict';

	angular.module('album')
	.component('album', {
		templateUrl: "album/album.html",
		controller: AlbumListController,
	});

	function AlbumListController() {
		this.$onInit = function(){
			console.log("AlbumListController initialized");
		}
	}
})();