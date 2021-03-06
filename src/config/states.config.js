(function(angular) {
	'use strict';

	angular
		.module('montage')
		.config(stateConfig)
		.run(redirectConfig);

	function redirectConfig($rootScope, $location, authService) {

		$rootScope.$on('$stateChangeStart', function(event, toState) {
			if(!authService.isAuthenticated() && toState.name !== 'login') {

				// Use `$location.path()` instead of `$state.go()` to avoid an infinite routing loop
				$location.path('/login');
			}
		})
	}

	function stateConfig($stateProvider, $locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/login');

		$stateProvider

			/************
			 * Misc
			 ************/

			.state('login', {
				url: '/login',
				template: '<login />'
			})
			.state('layout', {
				abstract: true,
				template: '<layout />'
			})


			/************
			 * Account
			 ************/

			.state('account', {
				parent: 'layout',
				template: '<account />'
			})
			.state('account.profile', {
				url: '/account',
				template: '<account-profile />'
			})
			.state('account.password', {
				url: '/account/password',
				template: '<account-password />'
			})


			/************
			 * Browsers
			 ************/

			.state('data', {
				abstract: true,
				parent: 'layout',
				template: '<empty-parent />'
			})
			.state('data.browser', {
				url: '/data',
				parent: 'data',
				template: '<record-browser />'
			})
			.state('data.edit', {
				url: '/data/:schemaName/:document_id',
				parent: 'data',
				template: '<record-edit />'
			})

			.state('fileBrowser', {
				url: '/files',
				parent: 'layout',
				template: '<file-browser />'
			})


			/************
			 * Policies
			 ************/

			.state('policy', {
				abstract: true,
				parent: 'layout',
				template: '<empty-parent />'
			})
			.state('policy.create', {
				url: '/policy/create',
				template: '<policy-form />'
			})
			.state('policy.edit', {
				url: '/policy/edit/:policy_id',
				template: '<policy-form />'
			})
			.state('policy.detail', {
				url: '/policy/:policy_id',
				template: '<policy-detail />'
			})
			.state('policy.list', {
				url: '/policy',
				template: '<policy-list />'
			})


			/************
			 * Roles
			 ************/

			.state('role', {
				abstract: true,
				parent: 'layout',
				template: '<empty-parent />'
			})
			.state('role.create', {
				url: '/roles/create',
				template: '<role-form />'
			})
			.state('role.edit', {
				url: '/roles/edit/:roleName',
				template: '<role-form />'
			})
			.state('role.detail', {
				url: '/roles/:roleName',
				template: '<role-detail />'
			})
			.state('role.list', {
				url: '/roles',
				template: '<role-list />'
			})


			/************
			 * Schemas
			 ************/

			.state('schema', {
				abstract: true,
				parent: 'layout',
				template: '<empty-parent />'
			})
			.state('schema.create', {
				url: '/schemas/create',
				template: '<schema-detail />'
			})
			.state('schema.detail', {
				url: '/schemas/:schemaName',
				template: '<schema-detail />'
			})
			.state('schema.list', {
				url: '/schemas',
				template: '<schema-list />'
			})


			/************
			 * Users
			 ************/

			.state('user', {
				abstract: true,
				parent: 'layout',
				template: '<empty-parent />'
			})
			.state('user.create', {
				url: '/users/create',
				template: '<user-form />'
			})
			.state('user.edit', {
				url: '/users/edit/:user_id',
				template: '<user-form />'
			})
			.state('user.detail', {
				url: '/users/:user_id',
				template: '<user-detail />'
			})
			.state('user.list', {
				url: '/users',
				template: '<user-list />'
			})
	}
})(angular);
