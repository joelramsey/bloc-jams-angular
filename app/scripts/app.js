var angularAppModule = angular.module('angularAppModule', ['ui-router']);

angularAppModule.config(function ($stateprovider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateprovider
        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })
        .state('landing', {
            url: 'landing',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        })
});
