(function (angular) {
	'use strict';

	angular
		.module('montage')
		.component('roleCreate', {
			templateUrl: 'views/role-create/role-create.html',
			controllerAs: 'roleCreate',
			controller: roleCreateController
		});

	function roleCreateController(api) {
		var vm = this;

		vm.createRole = function(roleName) {
			vm.isSaving = true;

			api.role.create(roleName)
				.then(() => vm.status = 'success')
				.catch(() => vm.status = 'error')
				.finally(() => vm.isSaving = false);
		}
	}
})(angular);
