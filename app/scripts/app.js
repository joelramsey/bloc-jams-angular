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

blocJamsAngular.controller('Collection.controller', ['$scope', function ($scope) {
    $scope.albums = [albumMarconi, albumPicasso, albumRamsey];
}]);

blocJamsAngular.controller('Album.controller', ['$scope', 'Player', function ($scope, Player) {
    $scope.albumPicasso = albumPicasso;
    $scope.play = function (song) {
        Player.setSong($scope.album, song);

    };
    $scope.pause = function () {
        Player.pause();
    };
}]);

blocJamsAngular.service('Player', function () {
    var getIndex = function (album, song) {
        return album.songs.indexOf(song);
    };

    var currentSoundFile = null;

    return {
        isPlaying: false,
        currentAlbum: null,
        currentSong: null,
        volume: 80,
        play: function () {
            currentSoundFile.play();
            this.isPlaying = true;
        },

        pause: function () {
            currentSoundFile.pause();
            this.isPlaying = false;

        },

        setSong: function (album, song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            this.play();
            this.setVolume(this.volume);
        },

        next: function () {
            var index = getIndex(this.currentAlbum, this.currentSong);
            index++;
            if (index >= this.currentAlbum.songs.length) {
                index = 0;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },

        previous: function () {
            var index = getIndex(this.currentAlbum, this.currentSong);
            index--;
            if (index < 0) {
                index = this.currentAlbum.songs.length - 1;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
    };
});
