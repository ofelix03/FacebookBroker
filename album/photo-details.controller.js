(function(){
	angular.module('album')

	.controller('PhotoDetailsController', PhotoDetailsController);

	PhotoDetailsController.$inject = ['photoDetails', 'FacebookService'];
	function PhotoDetailsController(photoDetails, FacebookService) {
		console.log("comments list in photodetailscontroller", photoDetails);
		this.photoDetails = photoDetails;
		console.log("photo name ", this.photoDetails);
		this.comment = {
			message: "sflsdfj",
			replyMessage: "heyslfjd"
		}

		this.publishComment = publishComment;
		this.publishCommentReply = publishCommentReply;

		function publishComment(message) {
			if (message !== undefined) {
				var payload = {message: message, photoId: this.photoDetails.id}
				FacebookService.publishComment(payload, null, function(data) {
					console.log("publish comment response succcessful", data)
					FacebookService.getComment({commentId: data.id}, null, function(data) {
						console.log("getcomment success response is ", data)
						// Add the comment message to the photoDetails(Photo object) and replace the copy in the cache storage
						// Now reload the browser
						
					}, function(data) {
						console.log("getcommetn fail response is ", data)
					})
				}, function(data){
					console.log("publish comment failed", data)
				})
			}
		}

		function publishCommentReply(replyMessage, commentId) {
			console.log("sending reply")
			if (replyMessage !== undefined) {
				console.log("sending reply message = " + replyMessage + "and commentId = " + commentId)
				var payload = {message: replyMessage, commentId: commentId}
			}
		}
	}
})();