angular.module("album")
.controller("NewAlbumController", NewAlbumController);

NewAlbumController.$inject = ['FacebookService'];
function NewAlbumController(FacebookService) {
	this.album = {
		name: "",
		description: "",
		photos: [],
	};

	this.isPbublished = false;
	this.isPublishedFailed = false;

	this.publish = publish;
	this.deletePhoto = deletePhoto;



	/** Functions */
	function publish(album) {
		this.album = album;
		console.log('publish now', album);
		var params = {
			name: album.name,
			description: album.description,
		}
		FacebookService.publishNewAlbum(params, null, function(data){
			console.log("positive reponse", data);
			var dataURItoBlob = function(dataURI) {
				var byteString = atob(dataURI.split(',')[1]);
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ab], { type: 'image/png' });
			}

			if (data.id !== null) {
				// Go ahead and publsih the photos
				console.log("Data ID " + data.id);
				var accessToken = "EAACEdEose0cBADs0jpFtHdgVaPast1xAEYc9UZACJ7QUfRywiFxPIfxJPauvZCits0kEvpFpcHnmcKmJAJugPCfaS6VVmT6ugN62TRAWlrdysdmUcoRq7DNxuzvWWXZB5BjNYNaC6u8eV5YBXQnTPIY9JtHxX7uvlIQdUdzDFmkkh8BMvFz3sgZAERarZBZAQZD";
				var parameters = {albumId: data.id}
				var requestPayload = {albumId: data.id, source: "%7B" + album.photos[0] + "%7D", "access_token": accessToken}
				console.log("payload is ", parameters, requestPayload)
				FacebookService.publishNewPhoto(requestPayload, null, function(data) {
					console.log("photo upload successful", data)
				}, function(data) {
					console.log("photo uploa failed ", data)
				})
				
			} else {
				console.log("No album id")
			}
		}, function(data){
			console.log("fail response", data);
		});
	}

	function buildBatchArray(albumId, photos) {
		var batch = [];
		var photo;
		for(var i = 0; i < photos.length; i++) {
			photo= photos[i];
			batch[i] = {
				method: "POST",
				relative_url:  albumId + "/photos",
				body: {
					source: photo
				}
			};
		}

		// console.log("batches", batch);
		return batch;
	}

	// function buildQueryStringFromJsonObject(object) {
	// 	var queryString = "{";
	// 	for(var i = 0; i < object.length; i++) {
	// 		if (i <)
	// 	}

	// 	queryString += "}";

	// 	return queryString;
	// }
	

	function deletePhoto(index) {
		console.log("deleting photo with index of " + index);
		this.album.photos.splice(index, 1);
	}

	
}