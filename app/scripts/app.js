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
    var albumsArray = [];
    for (var i = 0; i < 8; i++) {
        var currentAlbum = angular.copy(albumPicasso);
        albumsArray.push(currentAlbum);
    }

    $scope.albums = albumsArray;
}]);

blocJamsAngular.controller('Album.controller', ['$scope', 'Player', function ($scope, Player) {
    $scope.currentAlbum = Player.currentAlbum;
    $scope.currentSoundFile = Player.currentSoundFile;
    $scope.isPlaying = Player.playing;
    $scope.currentSongInAlbum = $scope.currentAlbum.songs[Player.currentSongIndex];

    $scope.playPause = function (songIndex) {
        Player.isPlaying(songIndex);

        if (Player.playing) {
            Player.pause();
        } else {
            Player.play();
        }
    };


    $scope.currentSongTime = function () {
        Player.currentSoundFile.unbind('timeupdate');
        Player.currentSoundFile.bind('timeupdate', function timeUpdate(event) {
            $scope.$apply(function () {
                $scope.currentTime = Player.currentSoundFile.getTime();
            })
        });
    };

    $scope.duration = Player.currentAlbum.songs[Player.currentSongIndex].length;

    var hoverSong = null;

    $scope.hoverIn = function (song) {
        hoverSong = song;
    };

    $scope.hoverOut = function () {
        hoverSong = null;
    };

    $scope.getState = function (song) {
        if (Player.playing && song === Player.currentSongIndex) {
            return 'playing';
        } else if (song === hoverSong) {
            return 'hovering';
        }
        return 'default';
    };

    $scope.nextSong = function () {
        Player.nextSong();
        $scope.currentSongInAlbum = $scope.currentAlbum.songs[Player.currentSongIndex];
        $scope.currentSongTime();
    };

    $scope.previousSong = function () {
        Player.previousSong();
        $scope.currentSongInAlbum = $scope.currentAlbum.songs[Player.currentSongIndex];
        $scope.currentSongTime();

    };

    $scope.playSong = function () {
        $scope.isPlaying = Player.playing;
        if (Player.playing) {
            Player.pause();
        } else {
            Player.play();
            $scope.currentSongTime();
        }
        $scope.isPlaying = Player.playing;
    };
}]);

blocJamsAngular.factory('Player', function () {
    var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
    var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
    var playerBarPlayButton = '<span class="ion-play"></span>';
    var playerBarPauseButton = '<span class="ion-pause"></span>';

    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentSongIndex: 0,
        currentSongInAlbum: null,
        currentVolume: 80,
        currentSongTime: 0,
        playing: false,
        pause: function () {
            this.playing = false;
            this.paused = true;
            this.currentSoundFile.pause();
        },

        play: function () {
            this.playing = true;
            this.paused = false;
            if (this.currentSoundFile === null) {
                this.setSong(this.currentSongIndex);
            }
            this.currentSoundFile.play();

        },

        nextSong: function () {
            this.currentSongIndex++;
            if (this.currentSongIndex === this.currentAlbum.songs.length) {
                this.currentSongIndex = 0;
            }
            this.setSong(this.currentSongIndex);
            this.play();

        },

        previousSong: function () {
            this.currentSongIndex--;
            if (this.currentSongIndex === -1) {
                this.currentSongIndex = this.currentAlbum.songs.length - 1;
            }
            this.setSong(this.currentSongIndex);
            this.play();

        },

        setSong: function (songIndex) {
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }
            this.currentSongIndex = songIndex;
            this.currentSongFromAlbum = this.currentAlbum.songs[songIndex];
            this.currentSoundFile = new buzz.sound(albumPicasso.songs[songIndex].audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            this.setVolume(this.currentVolume);
        },

        isPlaying: function (songIndex) {
            if (this.currentSongIndex === songIndex && this.paused === false) {
                this.playing = true;
            } else
                this.playing = false;
        },

        setVolume: function (volume) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setVolume(volume);
            }
        },

        updateSeekBarWhileSongPlays: function () {

            if (this.currentSoundFile) {

                this.currentSoundFile.bind('timeupdate', function timeUpdate(event) {

                });
            }
        },

        filterTimeCode: function (timeInSeconds) {
            var time = parseFloat(timeInSeconds);
            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time - minutes * 60);
            if (seconds >= 10) {
                var formatTime = minutes + ":" + seconds;
            } else {
                var formatTime = minutes + ":0" + seconds;
            }

            return formatTime;
        }
    }
});
