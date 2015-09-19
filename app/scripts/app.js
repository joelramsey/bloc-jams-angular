var blocJamsAngular = angular.module('blocJamsAngular', ['ui.router']);

blocJamsAngular.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider.state('landing', {
            url: '/',
            controller: 'Landing.controller',
            templateUrl: '/templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'Collection.controller',
            templateUrl: '/templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'Album.controller',
            templateUrl: '/templates/album.html'
        });
});

blocJamsAngular.controller('Landing.controller', ['$scope', function ($scope) {
    $scope.welcome = 'Turn the music up!';
}]);

blocJamsAngular.controller('Collection.controller', ['$scope', function ($scope) {
    $scope.albums = [];
    for (var x = 0; x < 12; x++) {
        $scope.albums.push(albumPicasso);
    }
}]);

blocJamsAngular.controller('Album.controller', ['$scope', 'Player', function ($scope, Player) {
    $scope.album = albumPicasso;
    Player.setAlbum(albumPicasso);
    $scope.play = function () {
        Player.play();
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
            if (currentSoundFile === null) {
                this.setSong(this.currentAlbum.songs[0]);
            }
            currentSoundFile.play();
            this.isPlaying = true;
        },
        pause: function () {
            currentSoundFile.pause();
            this.isPlaying = false;
        },
        setVolume: function (value) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(value);
            }
        },

        setAlbum: function (album) {
            this.currentAlbum = album;
        },

        setSong: function (song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }

            this.currentSong = song;
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
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
        next: function () {
            var index = getIndex(this.currentAlbum, this.currentSong);
            index++;
            if (index >= this.currentAlbum.songs.length) {
                index = 0;
            }
            var song = this.currentAlbum.songs[index];
            this.setSong(this.currentAlbum, song);
        },
        getTimePos: function () {
            if (currentSoundFile) {
                currentSoundFile.bind('timeupdate', function () {
                    return this.getTime() / this.getDuration();
                });
            }
        }
    };
});
