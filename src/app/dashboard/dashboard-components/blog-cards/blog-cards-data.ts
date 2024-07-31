export interface blogcard {
    title: string,
    subtitle: string,
    subtext: string,
    image: string,
    url : string
}

export const blogcards: blogcard[] = [

    {
        title: 'Crea un nuevo artista',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-artist.jpg',
        url : 'artists/create-artist'
    },
    {
        title: 'Crea una nueva canción',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-song.jpg',
        url : 'songs/create-song'
    },
    {
        title: 'Crea un nuevo álbum',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-album.jpg',
        url : 'albums/create-album'
    },
    {
        title: 'Crea un nuevo rol',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-role.jpg',
        url : 'roles/create-role'
    },

]
