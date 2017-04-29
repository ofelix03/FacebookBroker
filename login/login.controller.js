angular.module('login')
.controller('LoginController', LoginController)
.controller('PageSelectionController', PageSelectionController);

LoginController.$inject = ['FacebookAuthenticator', 'LocalStorage', '$state', '$rootScope']
function LoginController(FacebookAuthenticator, LocalStorage, $state, $rootScope) {
	var vm = this;

	vm.loginIntoFacebook = loginIntoFacebook;
	vm.isLoggedIn = false;


	function loginIntoFacebook() {
		LocalStorage.cleanEverything()

		console.log("Loging into facebook");
		FacebookAuthenticator.isConnected(function(response) {
			console.log("response", response);
			if (response.status == "connected") {
				console.log('already logged in', response);
				$rootScope.pageInfo.USER_ID = response.authResponse.id;
				$rootScope.pageInfo.USER_ACCESS_TOKEN = response.authResponse.accessToken;
				// $rootScope.pageInfo.isLoggedIn = true;
				LocalStorage.putUserId(response.authResponse.id)
				LocalStorage.putUserAccessToken(response.authResponse.accessToken);
				$state.go('selectPage');
			} else {
				console.log('not logged in')
				FacebookAuthenticator.login(function(response) {
					if (response.status == "connected") {
						$rootScope.USER_ID = response.authResponse.id;
						$rootScope.USER_ACCESS_TOKEN = response.authResponse.accessToken;
						$rootScope.isLoggedIn = true;
						LocalStorage.putUserId(response.authResponse.id);
						LocalStorage.putUserAccessToken(response.authResponse.accessToken);
						$state.go('selectPage');
					}
				});
			}
		});
	}
}


PageSelectionController.$inject = ['$state', '$rootScope', 'LocalStorage', 'FacebookService']
function PageSelectionController($state, $rootScope, LocalStorage, FacebookService) {
	console.log("PageSelectionController")
	var vm = this;

	vm.selectedPage = null;
	vm.pages = [{
		'name': 'Page 1',
		'id': '1234343',
		'access_token': '12343r432',
	},{
		'name': 'Page 2',
		'id': '1234343',
		'access_token': '12343r432',
	},{
		'name': 'Page 3',
		'id': '1234343',
		'access_token': '12343r432',
	},{
		'name': 'Page 4',
		'id': '1234343',
		'access_token': '12343r432',
	},]

	FacebookService.getAccounts({access_token: LocalStorage.getUserAccessToken()}, function(response) {
		console.log("accounts pos", response);
		vm.pages = response.data;
		console.log("vm.pages", vm.pages)
	}, function(response) {
		console.log("account neg", response);
	})


	vm.onPageSelect = onPageSelect;

	function onPageSelect() {
		console.log("selecte page = ", vm.selectedPage)
		if (vm.selectedPage !== undefined) {
			console.log("selected page is ", vm.selectedPage)
			LocalStorage.putPageId(vm.selectedPage.id);
			LocalStorage.putPageAccessToken(vm.selectedPage.access_token);

			$rootScope.pageInfo.PAGE_ID = vm.selectedPage.id;
			$rootScope.pageInfo.PAGE_ACCESS_TOKEN = vm.selectedPage.access_token;

			$state.go("app.albums", {})
		}
	}
}
