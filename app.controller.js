(function(){
	angular.module('facebookBrokerApp')
	.controller("AppController", AppController);

// AppController.$inject = ['pageInfo', '$stateParams'];
// 	function AppController(pageInfo, $stateParams) {
// 		this.pageInfo = pageInfo;
// 		console.log("$tateParams", $stateParams);
// 	}
// })();
// 
AppController.$inject = ['pageInfo', '$stateParams'];
	function AppController(pageInfo, $stateParams) {
		this.pageInfo = pageInfo;
		console.log("pageInfo = ", pageInfo)
		console.log("$tateParams", $stateParams);
	}
})();