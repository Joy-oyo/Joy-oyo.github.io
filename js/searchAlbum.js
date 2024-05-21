

function searchAlbums(artistId) {
    const apiUrl = `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&type=album&fmt=json`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const albums = data['release-groups'];
        const albumTable = document.getElementById('albumTable');
        albumTable.innerHTML = '<tr><th>Release Date</th><th>Album Name</th></tr>';
  
        albums.forEach(album => {
          const row = document.createElement('tr');
          const dateCell = document.createElement('td');
          const nameCell = document.createElement('td');
          dateCell.textContent = album['first-release-date'];
          nameCell.textContent = album.title;
          row.appendChild(dateCell);
          row.appendChild(nameCell);
          albumTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  