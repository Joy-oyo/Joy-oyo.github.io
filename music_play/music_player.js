var playlist = [

  { title: "Cheek to Cheek", 
    file: "Cheek_To_Cheek.mp3", 
    howl: null },

  { title: "I Fall In Love Too Easily", 
    file: "I_Fall_In_Love_Too_Easily.mp3", 
    howl: null },

  { title: "Almost blue", 
    file: "Chet_Baker_-_Almost_blue.mp3", 
    howl: null }
];

var Player = function(playlist) {
  this.playlist = playlist;
  this.index = 0;
};

function updateProgress() {
  var sound = player.playlist[player.index].howl;
  if (sound && sound.playing()) {
      var progress = (sound.seek() / sound.duration()) * 100 || 0;
      document.getElementById('progressBar').style.width = progress + '%';
      requestAnimationFrame(updateProgress);
  }
}

document.getElementById('progressContainer').addEventListener('click', function(event) {
  var sound = player.playlist[player.index].howl;
  if (sound) {
      var x = event.clientX - this.getBoundingClientRect().left;
      var width = this.offsetWidth;
      var duration = sound.duration();
      var clickPosition = (x / width) * duration;
      sound.seek(clickPosition);
  }
});


Player.prototype = {
  play: function(index) {
      var self = this;
      index = typeof index === 'number' ? index : self.index;
      var data = self.playlist[index];

      if (self.playlist[self.index].howl) {
          self.playlist[self.index].howl.stop();
      }

      if (!data.howl) {
          data.howl = new Howl({
              src: ['audio/' + data.file],
              html5: true,
              onplay: function() {
                document.getElementById('trackInfo').innerText = data.title; // Update the song title display
                requestAnimationFrame(updateProgress);
              }
          });
      }

      self.index = index;
      data.howl.play();
  },

  pause: function() {
      var sound = this.playlist[this.index].howl;
      if (sound && sound.playing()) {
          sound.pause();
      }
  },

  next: function() {
      var nextIndex = (this.index + 1) % this.playlist.length;
      this.play(nextIndex);
  },

  prev: function() {
      var prevIndex = (this.index - 1 + this.playlist.length) % this.playlist.length; 
  }
};

var player = new Player(playlist);

document.getElementById('playBtn').addEventListener('click', function() {
  player.play();
});

document.getElementById('pauseBtn').addEventListener('click', function() {
  player.pause();
});

document.getElementById('nextBtn').addEventListener('click', function() {
  player.next();
});

document.getElementById('prevBtn').addEventListener('click', function() {
  player.prev();
});
