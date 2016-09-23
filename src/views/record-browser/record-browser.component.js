(function (angular) {
	'use strict';

	angular
		.module('montage')
		.component('recordBrowser', {
			templateUrl  : 'views/record-browser/record-browser.html',
			controllerAs : 'recordBrowser',
			controller   : recordBrowserController
		});

	function recordBrowserController(api, montage, montageHelper, $state) {
		var vm = this;

		api.schema.list().then(schemaList => vm.schemaList = schemaList);

		vm.executeQuery = query => {
			montageHelper.getClient()
				.execute({ query })
				.then(response => {
					return vm.results = {
						schema       : getSchema(query.schema),
						documentList : response.data.query,
					};
				})
				.then(() => {
					if (!$state.params.schema) {
						$state.go('data.browser', query, { location: 'replace' } );
					}
				});
		};

		function getSchema(schemaName) {
			return vm.schemaList.filter(schema => schema.name === schemaName)[0];
		}
	}
})(angular);
