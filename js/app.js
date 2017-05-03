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

            appId: '',

            AllArtists: [],

            AllArtistsVisibility: true,
            artistPhotoVisibility: false,
            ArtistLyricsVisibility: false,
            LyricsVisibility: false,
            zelyricsVisibility: true,
            loading: false,

            isActive: true

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
                        app.lyricsFetched = response.data.result
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
                            app.loading = false
                        })
                        .catch(function (error) {
                            if(error.status){
                                alert(error)
                            }
                        })
                }
            }, 500),
            viewLyrics: function(message, event){
                this.loading = true // loading animation start
                var app = this  // for variable inheritance purposes
                if(event){
                    axios.get('http://api.zelyrics.com/rest1/getLyrics/'+ app.appId + '/' + message)
                        .then(function(response){
                            app.lyricsFetched = response.data.result
                            app.AllArtistsVisibility = false
                            app.LyricsVisibility = true
                            app.ArtistLyricsVisibility = false
                            app.getImage(app.currentArtist)
                            app.loading = false // loading animation end
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
                            app.currentLyricsArtistPhoto = response.data.result["0"].ArtistPhoto
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