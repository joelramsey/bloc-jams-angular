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
    
    $scope.currentSongTime = Player.currentSongTime;
    $scope.currentSongInAlbum = $scope.currentAlbum.songs[$scope.currentSongIndex];

    $scope.playPause = function(songIndex){
        Player.isPlaying(songIndex);

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
        pause: function() {
            this.playing = false;
            this.paused = true;
            this.currentSoundFile.pause();
        },
        
        play: function(){
            this.playing = true;
            this.paused = false;
            if (this.currentSoundFile === null){
                this.setSong(this.currentSongIndex);
            }
            this.currentSoundFile.play();
            this.updatePlayerBarSong();
        },
        nextSong: function(){
            this.currentSongIndex ++;
            if(this.currentSongIndex === this.currentAlbum.songs.length){
                this.currentSongIndex = 0;
            }
            this.setSong(this.currentSongIndex);
            this.play();
            this.updatePlayerBarSong();
        },
        previousSong: function(){
            this.currentSongIndex --;
            if(this.currentSongIndex === -1){
                this.currentSongIndex = this.currentAlbum.songs.length -1;
            }
            this.setSong(this.currentSongIndex);
            this.play();
            this.updatePlayerBarSong()
        },
        setSong: function(songIndex){
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }
            this.currentSongIndex = songIndex;
            this.currentSongFromAlbum = this.currentAlbum.songs[songIndex];
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
        
        updatePlayerBarSong: function(){
            $('.currently-playing .song-name').text(this.currentSongFromAlbum.name);
            $('.currently-playing .artist-name').text(this.currentSongFromAlbum.artist);
            $('.currently-playing .artist-song-mobile').text(this.currentSongFromAlbum.name + " - " + this.currentAlbum.artist);
            
        },
        updateSeekBarWhileSongPlays:  function() {
 
            if (this.currentSoundFile) {
       
                this.currentSoundFile.bind('timeupdate', function timeUpdate(event) {

                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    var $seekBar = $('.seek-control .seek-bar');

                    this.updateSeekPercentage($seekBar, seekBarFillRatio);
                    this.setCurrentTimeInPlayerBar(this.currentSoundFile.getTime());
                    this.setTotalTimeInPlayerBar(this.currentSoundFile.getDuration());
                });
            }
 
        },
        setCurrentTimeInPlayerBar: function(currentTime) {
            $(".current-time").text(this.filterTimeCode(currentTime));
         },

        setTotalTimeInPlayerBar: function(totalTime) {
            $(".total-time").text(this.filterTimeCode(totalTime));
         },

        filterTimeCode: function(timeInSeconds) {
            var time = parseFloat(timeInSeconds);
            var minutes = Math.floor(time/60);
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