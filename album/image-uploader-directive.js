(function(document){ 
	angular.module('album')
	.directive('imageUploader', ImageUploader);

	ImageUploader.$inject = [];
	function ImageUploader() {
		return {
			restrict: "E",
			templateUrl: "album/image-uploader.html",
			scope: {
				photos: "=",
				name: "="
			},
			link:link,
		}


		function link(scope, $element, $attrs) {
			var albumPhotos = scope.photos;
			var selectorElement  = angular.element(".image-selector");
			selectorElement.on("change", function(){
				console.log('onchange triggered');
				handleFiles(this.files);
			});



			function createImageWrapperWithImage() {
				var imageWrapper = document.createElement("div");
				imageWrapper.className = "image-wrapper";

				var image = document.createElement("img");
				image.className = "image";

				var span = document.createElement("span");
				span.className = "drop-image-button";

				var faSpan = document.createElement("span");
				faSpan.className = "fa fa-times";

				span.append(faSpan);
				imageWrapper.append(image)
				imageWrapper.append(span);

				return angular.element(imageWrapper);
			}

			function handleFiles(files) {
				var uploadedImagesElement = angular.element(".uploaded-images");
				var imageWrapper;

				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					var imageType = /^image\//;

					if (!imageType.test(file.type)) {
						continue;
					}

					var reader = new FileReader();
					reader.onload = (function(window, uploadedImagesElement, albumPhotos, file) { 
						return function(e) { 
							console.log("image loaded");
							scope.$apply(function(){
								albumPhotos[albumPhotos.length] = e.target.result;
							})
						}; 
					})(window, uploadedImagesElement,albumPhotos, file);

					// reader.onloadstart = (function(window, uploadedImagesElement) { 
					// 	return function(e) { 
					// 		console.log("image loading");
					// 	}; 
					// })(window, uploadedImagesElement);

					reader.readAsDataURL(file);
				}
			}
		}
	}
})(document);