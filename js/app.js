var app = new Vue({
        el: '#app',
        data: {
            currentLyricsArtistPhoto: '',
            currentLyricsArtist: '',
            currentLyricsTittle: '',
            lyricsText: '',
            artistLyrics: [],
            lyricsFetched: [],

            currentArtist: '',

            appId: 'ABCDEF12345'/* trial application key for trial (gives only a limited access to data) */,

            AllArtists: [],

            AllArtistsVisibility: true,
            artistPhotoVisibility: false,
            ArtistLyricsVisibility: false,
            LyricsVisibility: false,
            zelyricsVisibility: true,
            loading: false,

            isActive: true,

            presentArtist: '',
            presentLyricsTitle: '',
            presentLyricsText: ''

        },
        watch: {
            ArtistLyricsVisibility: function(){
                if(this.ArtistLyricsVisibility == true){
                    this.AllArtistsVisibility = false
                    this.LyricsVisibility = false
                    //this.firstRender()
                }
            },
            LyricsVisibility: function(){
                if(this.LyricsVisibility == true){
                    this.ArtistLyricsVisibility = false
                    this.AllArtistsVisibility = false
                }
            }
        },
        mounted: function(){
            this.firstRender()
        },
        methods: {
            firstRender: function(){
                this.loading = true // loading animation start
                var app = this  // for variable inheritance purposes
                axios.get('http://api.zelyrics.com/rest1/getAllArtists/' + app.appId)
                    .then(function(response){
                        app.AllArtists = response.data.result
                        app.currentArtist = ''
                        app.AllArtistsVisibility = true
                        app.LyricsVisibility = false
                        app.ArtistLyricsVisibility = false
                        app.loading = false // loading animation end
                    })
                    .catch(function (error) {
                        if(error.status){
                            alert(error)
                        }
                    })
            },
            viewArtist: _.debounce(function(message, event){
                this.currentLyricsArtistPhoto = ''
                this.loading = true;
                var app = this  // for variable inheritance purposes
                if(event){
                    axios.get('http://api.zelyrics.com/rest1/getLyricsByArtist/'+ app.appId + '/?artist=' + message)
                        .then(function(response){
                            app.artistLyrics = response.data.result
                            app.AllArtistsVisibility = false
                            app.LyricsVisibility = false
                            app.ArtistLyricsVisibility = true
                            app.currentArtist = message
                            app.getImage(message)
                        })
                        .catch(function (error) {
                            if(error.status){
                                alert(error)
                            }
                        })
                }
            }, 500),
            viewLyrics: function(message, event){
                this.currentLyricsArtistPhoto = ''
                this.loading = true // loading animation start
                var app = this  // for variable inheritance purposes
                if(event){
                    axios.get('http://api.zelyrics.com/rest1/getLyrics/'+ app.appId + '/' + message)
                        .then(function(response){
                            app.lyricsFetched = response.data.result
                            app.presentArtist = app.lyricsFetched.artist
                            app.presentLyricsTitle = app.lyricsFetched.title
                            app.presentLyricsText = app.lyricsFetched.lyrics_text
                            app.AllArtistsVisibility = false
                            app.LyricsVisibility = true
                            app.ArtistLyricsVisibility = false
                            app.getImage(app.currentArtist)
                        })
                        .catch(function (error) {
                            if(error.status){
                                alert(error)
                            }
                        })
                }
            },
            getImage: function(message){
                this.loading = true // loading animation start
                var app = this  // for variable inheritance purposes
                    axios.get('http://api.zelyrics.com/rest1/getArtist/'+ app.appId + '/?artist=' + message)
                        .then(function(response){
                            app.currentLyricsArtistPhoto = response.data.result.photo
                            if(app.currentLyricsArtistPhoto != null){
                                app.artistPhotoVisibility = true
                                app.loading = false // loading animation end
                            }
                        })
                        .catch(function (error) {
                            if(error.status){
                                alert(error)
                            }
                        })
            }
        }
    })