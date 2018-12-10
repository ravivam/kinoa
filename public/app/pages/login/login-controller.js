'use strict';

angular.module('KinoaApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $location, dpd, $http, AuthService, $log) {
        $scope.login = function () {
            if (!$scope.user || !$scope.user.email || !$scope.user.passwd) {
                $scope.error = "Please enter email and password";
                return;
            }
            delete $scope.error;
            $scope.loading = "Loading, please wait";
            AuthService.login({
                username: $scope.user.email,
                password: $scope.user.passwd
            }, function (result) {
                $location.path("/");
            }, function (err) {
                delete $scope.loading;
                $log.log(err);
                var errorMessage = "Trouble during your connection, please try again.";
                if (typeof err === 'undefined' || err === null || err === '') {
                    errorMessage = "There seems to be a problem with the server. If the problem persists, please contact Nobody.";
                } else if (err.status === 401) {
                    errorMessage = "Your username or password is not correct, please try again.";
                }
                $scope.error = errorMessage;
            })
        }

    });
