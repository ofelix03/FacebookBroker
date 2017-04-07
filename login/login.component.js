

angular.module('login')
.component('login', {
	'template': "<h1>Login {{ $ctrl.user.name }} -- {{$ctrl.someone.name}}</h1>",
	'controller': LoginController,
	'bindings': {
		'someone': '<'
	}
});

function LoginController() {
	this.user = {
		"name": "Felix Otoo"
	};
}