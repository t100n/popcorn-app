App.getTorrentsCollection = function (options) {

    //var url = 'http://subapi.com/';
    var url = 'http://yts.re/api/';

    var supportedLanguages = ['english', 'french', 'dutch', 'portuguese', 'romanian', 'spanish', 'turkish', 'brazilian', 
                              'italian', 'german', 'hungarian', 'russian', 'ukrainian', 'finnish', 'bulgarian', 'latvian'];
    if (options.genre) {
        //url += options.genre.toLowerCase() + '.json';
        url += 'list.json?sort=date&order=desc&genre='+options.genre.toLowerCase();
    } else {
        if (options.keywords) {
            //url += 'search.json?query=' + options.keywords;
            url += 'list.json?sort=date&order=desc&keywords=' + options.keywords;
        } else {
            //url += 'popular.json';
            url += 'list.json?sort=date&order=desc';
        }
    }

    if (options.page && options.page.match(/\d+/)) {
        var str = url.match(/\?/) ? '&' : '?';
        url += str + 'set=' + options.page;
    }

    console.log("getTorrentsCollection: "+url);

    var MovieTorrentCollection = Backbone.Collection.extend({
        url: url,
        model: App.Model.Movie,
        parse: function (data) {
            
            var movies = [];

            //console.log(data);
            var moviesList = {};

            data.MovieList.forEach(function (movie) {

                var videos = {};
                var torrents = {};
                torrent = '';
                quality = '';
                var subtitles = {};

                // Put the video and torrent list into a {quality: url} format
                /*for( var k in movie.videos ) {
                    if( typeof videos[movie.videos[k].quality] == 'undefined' ) {
                      videos[movie.videos[k].quality] = movie.videos[k].url;
                    }
                }*/
                videos[movie.Quality] = movie.MovieUrl;

                /*for( var k in movie.torrents ) {
                  if( typeof torrents[movie.torrents[k].quality] == 'undefined' ) {
                    torrents[movie.torrents[k].quality] = movie.torrents[k].url;
                  }
                }*/
                torrents[movie.Quality] = movie.TorrentUrl;

                // Pick the worst quality by default
                if( typeof torrents['720p'] != 'undefined' ){ quality = '720p'; torrent = torrents['720p']; }
                else if( typeof torrents['1080p'] != 'undefined' ){ quality = '1080p'; torrent = torrents['1080p']; }

                /*for( var k in movie.subtitles ) {
                    if( supportedLanguages.indexOf(movie.subtitles[k].language) < 0 ){ continue; }
                    if( typeof subtitles[movie.subtitles[k].language] == 'undefined' ) {
                        subtitles[movie.subtitles[k].language] = movie.subtitles[k].url;
                    }
                }*/
                //subtitles["portuguese"] = movie.ImdbLink;

                //if( (typeof movie.subtitles == 'undefined' || movie.subtitles.length == 0) && (typeof movie.videos == 'undefined' || movie.videos.length == 0) ){ return; }
                
                /*movies.push({
                    imdb:       movie.imdb_id,
                    title:      movie.title,
                    year:       movie.year,
                    runtime:    movie.runtime,
                    synopsis:   movie.synopsis,
                    voteAverage:movie.vote_average,

                    image:      movie.poster,
                    bigImage:   movie.poster,
                    backdrop:   movie.backdrop,

                    quality:    quality,
                    torrent:    torrent,
                    torrents:   torrents,
                    videos:     videos,
                    subtitles:  subtitles,
                    seeders:    movie.seeders,
                    leechers:   movie.leechers
                });*/
                
                var movieObj = {
                    imdb:       movie.ImdbCode,
                    title:      movie.MovieTitle,
                    year:       parseInt(movie.MovieYear),
                    runtime:    0,
                    synopsis:   movie.MovieTitleClean,
                    voteAverage:parseFloat(movie.MovieRating),

                    image:      movie.CoverImage,
                    bigImage:   movie.CoverImage,
                    backdrop:   movie.CoverImage,

                    quality:    quality,
                    torrent:    torrent,
                    torrents:   torrents,
                    videos:     videos,
                    subtitles:  subtitles,
                    seeders:    movie.TorrentSeeds,
                    leechers:   movie.TorrentPeers
                }

                if(typeof moviesList[movie.ImdbCode] == "undefined") {
                    moviesList[movie.ImdbCode] = movieObj;
                }//if
                else {
                    moviesList[movie.ImdbCode].torrents[movie.Quality] = movie.TorrentUrl;
                }//else

                //console.log(movieObj);

                //movies.push(movieObj);
            });
            
            for(var i in moviesList) {
                movies.push(moviesList[i]);
            }//for

            return movies;
        }
    });

    return new MovieTorrentCollection();
};
