(angular => {
	'use strict';

	angular
		.module('montage')
		.component('recordEdit', {
			templateUrl : 'views/record-edit/record-edit.html',
			controller	: recordEditController,
		});

	function recordEditController($stateParams, $state, $scope, $mdDialog, api, Record) {
		$scope.document_id = $stateParams.document_id;

		Record.get($stateParams.schemaName, $stateParams.document_id)
			.then(record => $scope.record = record);

		$scope.saveContext = 'Save';

		$scope.excludeRecordProperty = function(key) {
			const isPrivateField = ['id', '_meta'].includes(key);
			const isBoolean = $scope.metaDictionary[key].datatype === 'boolean';

			return isPrivateField || isBoolean;
		};

		$scope.aliasInputType = function(datatype) {
			return datatype === 'number' ? 'number' : 'text';
		};

		$scope.showAddFieldDialog = function(event) {
			$mdDialog.show({
				contentElement : '#myDialog',
				parent         : angular.element(document.body),
				targetEvent    : event,
				scope          : $scope,
				preserveScope  : true,
				controller     : addFieldDialogController,
			})
			.then(answer => {
				answer.value = coerceType(answer.datatype, answer.value);
				$scope.record[answer.field] = answer.value;
				createMeta($scope.fields, $scope.record, answer);
			});
		};

		$scope.showDeleteRecordDialog = function(event) {
			const confirmDialog = $mdDialog.confirm()
				.title('Are you sure you want to delete this record?')
				.ariaLabel('Delete record')
				.targetEvent(event)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirmDialog)
				.then(deleteRecord);
		};

		$scope.saveRecord = function (record) {
			record.save();
		};

		function createMeta(newField) {
			$scope.newField = $scope.newField || newField || {};

			extendFields();

			$scope.metaDictionary = {};

			for (let key in $scope.schemaFields) {
				if ($scope.schemaFields[key]) {
					$scope.metaDictionary[$scope.schemaFields[key]['name']] = $scope.schemaFields[key];
				}
			}

			for (let key in $scope.record) {
				if ($scope.record[key] instanceof Object) {
					$scope.record[key] = JSON.stringify($scope.record[key]);
				}
			}
		}

		function extendFields() {
			$scope.schemaFields.forEach(field => {
				if (!$scope.record[field.name]) {
					$scope.record[field.name] = field.name.replace("field", "value");
				}
			});

			Object.keys($scope.record).forEach(field => {
				if (!$scope.newField.datatype) { $scope.newField.datatype = 'text'; }

				const fieldNames = $scope.schemaFields.map(field => field.name)
				const fieldTemplate = {
					datatype : $scope.newField.datatype,
					index		 : '',
					required : false,
					name		 : field,
				};

				if (!fieldNames.includes(field) && field !== '_meta') {
					$scope.schemaFields.splice(field - 1, 0, fieldTemplate);
				}
			});
		}

		function showErrorMessage(message = 'Unable to save changes. Please try again.') {
			$scope.status = 'error';
			$scope.followUpMessage = message;
		}

		function showSuccessMessage(message = 'Changes saved') {
			$scope.status = 'success';
			$scope.followUpMessage = message;
		}

		function deleteRecord() {
			api.document
				 .remove($stateParams.schemaName, $stateParams.document_id)
				 .then(() => { $state.go('data.browser') });
		}

		function updateRecord() {
			$scope.isSaving = true;

			api.documents
				 .update(schemaName, $scope.record)
				 .then(showSuccessMessage)
				 .catch(showErrorMessage)
				 .finally(() => {
					 $scope.isSaving = false
				 });
		}

		function coerceType(type, value) {
			if (['true', 'false'].includes(value) && type === 'boolean') {
				return Boolean(value);
			}

			if (parseFloat(value) !== NaN && type === 'number') {
				return parseFloat(value);
			}

			return value;
		}

		function validateJSON(snippet, fieldName, form) {
			try {
				JSON.parse(snippet);
			} catch(error) {
				$scope.JSONParseError = error.toString();

				return false;
			}

			return true;
		}

		function addFieldDialogController($scope, $mdDialog) {

			$scope.updateMeta = function(key, datatype) {
				$scope.addFormMetaDictionary = {};

				$scope.addFormMetaDictionary[key] = {
					datatype : datatype,
					index    : '',
					required : false,
					name     : key,
				};

				$scope.validateField($scope.addFormMetaDictionary, $scope.addFieldForm);
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
				resetForm($scope.addFieldForm);
			};

			$scope.answer = function() {
				$mdDialog.hide($scope.newField);
				resetForm($scope.addFieldForm);
			};
		}

		function validateField(fieldObject, form) {
			if (Array.isArray(fieldObject.value) && form.datatype === 'array') {
				if (fieldObject.value[0] !== '[') {
					return false;
				}
				return validateJSON(fieldObject.value, fieldObject.name, form);
			}

			if (typeof fieldObject.value === "object" && !Array.isArray(fieldObject.value) && fieldObject.value !== null) {
				if (fieldObject.value[0] !== '{') {
					return false;
				}
				return validateJSON(fieldObject.value, fieldObject.name, form);
			}

			return true;
		}

		function resetForm(form) {
			form.$setPristine();
			form.$setUntouched();
		}
	}
})(angular);
