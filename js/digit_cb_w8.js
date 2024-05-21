function searchArtist() {
    const artistName = document.getElementById('artistInput').value;
    const baseUrl = 'https://musicbrainz.org/ws/2/artist/?query=';
    const url = `${baseUrl}${encodeURIComponent(artistName)}&fmt=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const artistList = data.artists;
            const artistResultsDiv = document.getElementById('artistResults');
            artistResultsDiv.innerHTML = '';

            artistList.forEach(artist => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = artist.name;
                link.addEventListener('click', () => searchAlbums(artist.id));
                artistResultsDiv.appendChild(link);
                artistResultsDiv.appendChild(document.createElement('br'));
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function searchAlbums(artistId) {
    const url = `https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json&inc=release-groups+media+labels`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const albumList = data.releases;
            const albumResultsDiv = document.getElementById('albumResults');
            albumResultsDiv.innerHTML = '';

            const table = document.createElement('table');
            const headerRow = document.createElement('tr');
            const dateHeader = document.createElement('th');
            dateHeader.textContent = 'Release Date';
            const nameHeader = document.createElement('th');
            nameHeader.textContent = 'Album Name';
            const statusHeader = document.createElement('th');
            statusHeader.textContent = 'Status';
            const countryHeader = document.createElement('th');
            countryHeader.textContent = 'Country';
            headerRow.appendChild(dateHeader);
            headerRow.appendChild(nameHeader);
            headerRow.appendChild(statusHeader);
            headerRow.appendChild(countryHeader);
            table.appendChild(headerRow);

            albumList.forEach(album => {
                const row = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateCell.textContent = album.date;
                const nameCell = document.createElement('td');
                const albumLink = document.createElement('a');
                albumLink.href = '#';
                albumLink.textContent = album.title;
                albumLink.addEventListener('click', () => displayAlbumDetails(album.id));
                nameCell.appendChild(albumLink);
                const statusCell = document.createElement('td');
                statusCell.textContent = album.status;
                const countryCell = document.createElement('td');
                countryCell.textContent = album.country;
                row.appendChild(dateCell);
                row.appendChild(nameCell);
                row.appendChild(statusCell);
                row.appendChild(countryCell);
                table.appendChild(row);
            });

            albumResultsDiv.appendChild(table);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayAlbumDetails(albumId) {
    const url = `https://musicbrainz.org/ws/2/release/${albumId}?fmt=json&inc=recordings+artist-credits`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const albumDetails = document.createElement('div');
            albumDetails.innerHTML = `
                <h2>${data.title}</h2>
                <p>Artist: ${data['artist-credit'][0].name}</p>
                <p>Release Date: ${data.date}</p>
                <p>Country: ${data.country}</p>
                <p>Status: ${data.status}</p>
                <h3>Tracklist:</h3>
                <ul>
                    ${data.media.map(medium => medium.tracks.map(track => `<li>${track.title}</li>`).join('')).join('')}
                </ul>
            `;
            document.body.appendChild(albumDetails);
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred. Please try again later.';
            artistResultsDiv.appendChild(errorMessage);
        });
}

document.getElementById('searchButton').addEventListener('click', searchArtist);