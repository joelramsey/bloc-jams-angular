var angularAppModule = angular.module('angularAppModule', ['ui-router']);

angularAppModule.config(function ($stateprovider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
