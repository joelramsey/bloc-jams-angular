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
        Player.setCurrentAlbum(albumPicasso);
    $scope.play = function () {
        Player.play();
    };
    $scope.pause = function () {
        Player.pause();
    };
    $scope.previous = function () {
        Player.previous();
    };
    $scope.next = function () {
        Player.next();
    };
    
}]);

blocJamsAngular.service('Player', function () {
    
    var currentSoundFile = null;
    return {
        isPlaying: false,
        currentAlbum: null,
        currentSong: null,
        currentSongFromAlbum: null,
        volume: 80,
        
        play: function () {
            if (currentSoundFile === null) {
                this.setSong();
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

        setCurrentAlbum: function (album) {
            this.currentAlbum = album;
        },

        setSong: function () {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            
            var song = 0;
            
            this.currentlyPlayingSongNumber = song;
            this.currentSongFromAlbum = this.currentAlbum.songs[song];

            currentSoundFile = new buzz.sound(this.currentSongFromAlbum.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
        },
        
        getIndex: function (album, song) {
            return album.songs.indexOf(song);    
        },

        previous: function () {
            
            var getLastSongNumber = function(index) {
        
            return index == 0 ? currentAlbum.songs.length : index;
            };
            var currentSongIndex = this.getIndex(this.currentAlbum, this.currentSongFromAlbum);
            this.currentSongIndex--;
            if(this.currentSongIndex < 0) {
                currentSongIndex = currentAlbum.songs.length - 1;
            }
            
            this.setSong(this.currentSongIndex + 1);
            //this.currentSoundFile.play();
            currentSoundFile.play()
            
        },
        next: function () {
            
        var getLastSongNumber = function(index) {
        
            return index == 0 ? currentAlbum.songs.length : index;
        };
            var currentSongIndex = this.getIndex(this.currentAlbum, this.currentSongFromAlbum);
            this.currentSongIndex++;
            if(this.currentSongIndex >= this.currentAlbum.songs.length) {
                currentSongIndex = 0;
            }
            
            this.setSong(this.currentSongIndex + 1);
            //this.currentSoundFile.play();
            currentSoundFile.play()
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
