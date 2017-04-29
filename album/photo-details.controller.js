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
			message: null,
			replyMessage: [vm.photoDetails.getCommentsCount()]
		}

		vm.isPublishingComment = false;
		vm.isPuslishingCommentReply = [];
		for (var i in vm.photoDetails.getComments()) {
			vm.isPuslishingCommentReply.push(false);
		}

		for (var i = 0; i < vm.comment.replyMessage.length; i++) {
			vm.comment.replyMessage[i] = "";
		}

		vm.commentReplyThreadsVisible = []
		hideAllCommentReplyThreads();


		function hideAllCommentReplyThreads() {
			for (var i in vm.photoDetails.getComments()) {
				vm.commentReplyThreadsVisible.push(false);
			}
		}

		function showReplyThreadsForComment(commentId) {
			if (commentId !== undefined) {
				for (var i in vm.photoDetails.getComments()) {
					if (vm.photoDetails.getComments()[i].id === commentId) {
						console.log("comment found, let show it reply threads");
						vm.commentReplyThreadsVisible[i] = true;
					}
				}
			}
		}

		function hideReplyThreadsForComment(commentId) {
			if (commentId !== undefined) {
				for (var i in vm.photoDetails.getComments()) {
					if (vm.photoDetails.getComments()[i].id === commentId) {
						console.log("comment found, let show it reply threads");
						vm.commentReplyThreadsVisible[i] = false;
					}
				}
			}
		}



		vm.updateCommentList = updateCommentList;
		vm.updateCommmentRepliesList = updateCommmentRepliesList;
		vm.publishComment = publishComment;
		vm.publishCommentReply = publishCommentReply;
		vm.onCommentReplyIconClick = onCommentReplyIconClick;

		function onCommentReplyIconClick(commentIndex) {
			console.log("onCommentReplyIconClick");
			if (vm.commentReplyThreadsVisible[commentIndex] === false) {
				vm.commentReplyThreadsVisible[commentIndex] = true;
			} else {
				vm.commentReplyThreadsVisible[commentIndex] = false;
			}
		}

		function showIsPublishingCommentFeedback() {
			vm.isPublishingComment = true;
		}

		function hideIsPublishingCommentFeedback() {
			vm.isPublishingComment = false;
		}

		function showIsPublishingCommentFeedbackReplyFeedback(commentIndex) {
			vm.isPuslishingCommentReply[commentIndex] = true;
		}

		function hideIsPublishingCommentFeedbackReplyFeedback(commentIndex) {
			vm.isPuslishingCommentReply[commentIndex] = false;
		}

		function publishComment(message) {
			console.log("message", message)
			if (message !== null) {
				console.log("messsage again", message)
				showIsPublishingCommentFeedback();
				var payload = {message: message, photoId: vm.photoDetails.id, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()};
				FacebookService.publishComment(payload, null, function(data) {
					FacebookService.getComment({commentId: data.id, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, null, function(data) {
						var comment = {
							id: data.id,
							from: data.from,
							message: data.message,
							created_time: data.created_time,
						}
						LocalStorage.addNewPhotoComment(comment, vm.photoId, vm.albumId)
						vm.updateCommentList(ModelParserUtil.parseToCommentObject(comment))
						hideIsPublishingCommentFeedback();
					});
				}, function(data){
					console.log("publish comment failed", data)
					// @todo show some feedback if publishing new comment fails.
					// This could be due to  network problem.
				});
			}
		}

		function publishCommentReply(replyMessage, commentId, commentIndex) {
			if (replyMessage !== undefined) {
				showIsPublishingCommentFeedbackReplyFeedback(commentIndex)
				var payload = {message: replyMessage, commentId: commentId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()};
				FacebookService.publishCommentReply(payload, null, function(response) {
					var replyId = response.id
					FacebookService.getComment({commentId: replyId, access_token: LocalStorage.getPageAccessToken(), pageId: LocalStorage.getPageId()}, function(response) {
						LocalStorage.addNewPhotoCommentReply(response, commentId, vm.photoId, vm.albumId);
						vm.updateCommmentRepliesList(ModelParserUtil.parseToCommentObject(response), commentId);
						hideIsPublishingCommentFeedbackReplyFeedback(commentIndex)
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