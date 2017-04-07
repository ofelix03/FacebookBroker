(function(){
	'use strict';

	angular.module('album')
	.component('imageUploader', {
		templateUrl: "/album/image-uploader.html",
		controller: ImageUploader,
	});

	// ImageUploader.$inject = [];
	function ImageUploader() {
		console.log("image uploaded ctrl loaded");

		this.$postLink = function($element) {
			console.log("psot link actiated");
			console.log("element", $element);
			console.log("mythis", this);
		}
	}
})();