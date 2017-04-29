(function(){
	angular.module('facebookBrokerApp')
	.controller("AppController", AppController);

	AppController.$inject = ['pageInfo', '$stateParams', '$rootScope', 'FacebookAuthenticator', 'LocalStorage'];
	function AppController(pageInfo, $stateParams, $rootScope, FacebookAuthenticator, LocalStorage) {
		var vm = this;
		vm.pageInfo = pageInfo;
		
		vm.logout = logout;


		function logout() {
			console.log("Logging out right now")
			$rootScope.logout();
			// FacebookAuthenticator.logout(function(response) {
			// 	console.log("logout positive", response);
			// 	window.location.reload();
			// }, function(response){
			// 	console.log('logout negative', response);
			// });
		}
	}
})();