export interface blogcard {
    title: string,
    subtitle: string,
    subtext: string,
    image: string,
    url : string
}

export const blogcards: blogcard[] = [

    {
        title: 'CREA_UN_NUEVO_ARTISTA',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-artist.jpg',
        url : 'artists/create-artist'
    },
    {
        title: 'CREA_UNA_NUEVA_CANCION',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-song.jpg',
        url : 'songs/create-song'
    },
    {
        title: 'CREA_UN_NUEVO_ALBUM',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-album.jpg',
        url : 'albums/create-album'
    },
    {
        title: 'CREA_UN_NUEVO_ROL',
        subtitle: '',
        subtext: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'assets/images/bg/create-role.jpg',
        url : 'roles/create-role'
    },

]
