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

blocJamsAngular.controller('Collection.controller', ['$scope', function($scope) {
    var albumsArray = [];
    for (var i = 0; i < 8; i++) {
        var currentAlbum = angular.copy(albumPicasso);
        albumsArray.push(currentAlbum);
    }

    $scope.albums = albumsArray;
}]);

blocJamsAngular.controller('Album.controller', ['$scope', 'Player', function($scope, Player) {
    $scope.currentAlbum = Player.currentAlbum;
    $scope.currentSoundFile = Player.currentSoundFile;
    $scope.currentSongIndex = Player.currentSongIndex;
    $scope.isPlaying = Player.playing;
    Player.trackTime();
    $scope.currentSongTime = Player.currentSongTime;
    $scope.currentSongInAlbum = $scope.currentAlbum.songs[$scope.currentSongIndex];

    $scope.playPause = function(songIndex){
        Player.isPlaying(songIndex);
        Player.setSong(songIndex);

        if(Player.playing){
            Player.pause();
        }
        else{
            Player.play();
        }
    };

    $scope.nextSong = function() {
        Player.nextSong();
    };

    $scope.previousSong = function() {
        Player.previousSong();
    };

    $scope.playSong = function(){
        $scope.isPlaying = Player.playing;
        if(Player.playing){
            Player.pause();
        }
        else{
            Player.play();
        }
        $scope.isPlaying = Player.playing;
    };
}]);

blocJamsAngular.factory('Player', function() {
    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentSongIndex: -1,
        currentSongInAlbum: null,
        currentVolume: 50,
        currentSongTime: 0,
        playing: false,
        pause: function() {
            this.playing = false;
            this.paused = true;
            this.currentSoundFile.pause();
        },
        play: function(){
            this.playing = true;
            this.paused = false;
            this.currentSoundFile.play();
        },
        nextSong: function(){
            this.currentSongIndex ++;
            if(this.currentSongIndex === this.currentAlbum.songs.length){
                this.currentSongIndex = 0;
            }
            this.setSong(this.currentSongIndex);
            this.play();
        },
        previousSong: function(){
            this.currentSongIndex --;
            if(this.currentSongIndex === -1){
                this.currentSongIndex = this.currentAlbum.songs.length -1;
            }
            this.setSong(this.currentSongIndex);
            this.play();
        },
        setSong: function(songIndex){
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }

            this.currentSongIndex = songIndex;
            this.currentSoundFile = new buzz.sound(albumPicasso.songs[songIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            this.setVolume(this.currentVolume);
        },
        isPlaying: function(songIndex){
            if(this.currentSongIndex === songIndex && this.paused === false) {
                this.playing = true;
            }
            else
                this.playing = false;
        },
        setVolume: function(volume) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setVolume(volume);
            }
        },
        setTime: function(time) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setTime(time);
            }
        },
        trackTime: function() {
            if (this.currentSoundFile) {
                this.currentSongTime = this.currentSoundFile.getTime();
            }
        }
    }
});