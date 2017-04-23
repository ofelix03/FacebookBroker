(function(){
	angular.module('album')

	.controller('PhotoDetailsController', PhotoDetailsController);

	PhotoDetailsController.$inject = ['photoDetails', 'FacebookService', 'LocalStorage', '$stateParams'];
	function PhotoDetailsController(photoDetails, FacebookService, LocalStorage, $stateParams) {

		var vm = this;
		vm.albumId = $stateParams.albumId;
		vm.photoId = $stateParams.photoId;
		vm.photoDetails = photoDetails;
		vm.comment = {
			message: "",
			replyMessage: [vm.photoDetails.getCommentsCount()]
		}

		for (var i = 0; i < vm.comment.replyMessage.length; i++) {
			vm.comment.replyMessage[i] = "";
		}


		vm.updateCommentList = updateCommentList;
		vm.updateCommmentRepliesList = updateCommmentRepliesList;
		vm.publishComment = publishComment;
		vm.publishCommentReply = publishCommentReply;

		function publishComment(message) {
			if (message !== undefined) {
				var payload = {message: message, photoId: vm.photoDetails.id}
				FacebookService.publishComment(payload, null, function(data) {
					FacebookService.getComment({commentId: data.id}, null, function(data) {
						var comment = {
							id: data.id,
							from: data.from,
							message: data.message,
							created_time: data.created_time,
						}
						LocalStorage.addNewPhotoComment(comment, vm.photoId, vm.albumId)
						vm.updateCommentList(ModelParserUtil.parseToCommentObject(comment))
					});
				}, function(data){
					console.log("publish comment failed", data)
					// @todo show some feedback if publishing new comment fails.
					// This could be due to  network problem.
				});
			}
		}

		function publishCommentReply(replyMessage, commentId) {
			if (replyMessage !== undefined) {
				var payload = {message: replyMessage, commentId: commentId}
				FacebookService.publishCommentReply(payload, null, function(response) {
					var replyId = response.id
					FacebookService.getComment({commentId: replyId}, function(response) {
						LocalStorage.addNewPhotoCommentReply(response, commentId, vm.photoId, vm.albumId);
						vm.updateCommmentRepliesList(ModelParserUtil.parseToCommentObject(response), commentId);
					}, function(response) {
						console.log("comment reply payload failed with payload", response)
					});
				}, function(response) {
					console.log("comment reply creation failed with data ", response)
				});
			}


		}

		function updateCommentList(comment) {
			if (comment !== undefined) {
				vm.photoDetails.setComment(comment)
				vm.comment.message = "";
			}
		}

		function updateCommmentRepliesList(replyComment, commentId) {
			var comments = vm.photoDetails.getComments();
			for (var i = 0; i < comments.length; i++) {
				if (comments[i].getId() === commentId) {
					comments[i].setReply(replyComment);
					vm.comment.replyMessage[i] = "";
					break;
				}
			}
		}
	}
})();