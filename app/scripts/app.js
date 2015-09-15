var blocJamsAngular = angular.module('blocJamsAngular', ['ui.router']);


blocJamsAngular.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
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
            url: '/landing',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'

        })

    $urlRouterProvider.otherwise("/landing");

});


blocJamsAngular.controller('Landing.controller', function ($scope) {
    $scope.welcome = 'Turn the music up!';
});

blocJamsAngular.controller('Album.controller', function ($scope) {
    $scope.albumPicasso = albumPicasso;
});

blocJamsAngular.controller('Collection.controller', function ($scope) {
    $scope.albums = [albumPicasso, albumMarconi, albumRamsey];
});
