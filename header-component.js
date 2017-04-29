(function(){
	'use strict';

	angular.module("facebookBrokerApp")

	.component("headerLayout", {
		templateUrl: "header.html",
		controller: HeaderController,
		bindings: {
			pageInfo: "<",
			onLogout: "<",
		}
	});


	HeaderController.$inject = [];
	function HeaderController() {
		var self = this;

		self.$onInit = onInitFnc;

		function onInitFnc() {
			
		}


	}

})();