"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Genre;
(function (Genre) {
    Genre["Horror"] = "Horror";
    Genre["Fantastic"] = "Fantastic";
    Genre["Thriller"] = "Thriller";
    Genre["Romance"] = "Romance";
    Genre["Fiction"] = "Fiction";
})(Genre || (Genre = {}));
// base media representation for the project
var Media = /** @class */ (function () {
    function Media(_name, _description, _genre, _pictureLocation, identifier) {
        this._name = _name;
        this._description = _description;
        this._genre = _genre;
        this._pictureLocation = _pictureLocation;
        if (identifier) {
            this._identifier = identifier;
        }
        else {
            // use UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }
    Object.defineProperty(Media.prototype, "identifier", {
        // since we've private fields, we access them using the accessors
        // getters and setters
        get: function () {
            return this._identifier;
        },
        set: function (identifier) {
            this._identifier = identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Media.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Media.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Media.prototype, "genre", {
        get: function () {
            return this._genre;
        },
        set: function (genre) {
            this._genre = genre;
        },
        enumerable: true,
        configurable: true
    });
    return Media;
}());
// our book
var Book = /** @class */ (function (_super) {
    __extends(Book, _super);
    function Book(name, description, pictureLocation, genre, author, numberOfPages, identifier) {
        var _this = _super.call(this, name, description, genre, pictureLocation, identifier) || this;
        _this._author = author;
        _this._numberOfPages = numberOfPages;
        return _this;
    }
    Object.defineProperty(Book.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function (author) {
            this._author = author;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Book.prototype, "numberOfPages", {
        get: function () {
            return this._numberOfPages;
        },
        set: function (numberOfPages) {
            this._numberOfPages = numberOfPages;
        },
        enumerable: true,
        configurable: true
    });
    return Book;
}(Media));
var IMDBRating;
(function (IMDBRating) {
    IMDBRating[IMDBRating["veryPoor"] = 1] = "veryPoor";
    IMDBRating[IMDBRating["Poor"] = 2] = "Poor";
    IMDBRating[IMDBRating["Good"] = 3] = "Good";
    IMDBRating[IMDBRating["VeryGood"] = 4] = "VeryGood";
    IMDBRating[IMDBRating["Excellent"] = 5] = "Excellent";
})(IMDBRating || (IMDBRating = {}));
// our movie, another type of media
var Movie = /** @class */ (function (_super) {
    __extends(Movie, _super);
    function Movie(name, description, pictureLocation, genre, duration, director, imdbRating, identifier) {
        var _this = _super.call(this, name, description, genre, pictureLocation, identifier) || this;
        _this._director = director;
        _this._duration = duration;
        _this._imdbRating = imdbRating;
        return _this;
    }
    Object.defineProperty(Movie.prototype, "director", {
        get: function () {
            return this._director;
        },
        set: function (director) {
            this._director = director;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Movie.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (duration) {
            this._duration = duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Movie.prototype, "imdbRating", {
        get: function () {
            return this._imdbRating;
        },
        set: function (imdbRating) {
            this._imdbRating = imdbRating;
        },
        enumerable: true,
        configurable: true
    });
    return Movie;
}(Media));
// MediaCollection of only Media types using Generics
var MediaCollection = /** @class */ (function () {
    function MediaCollection(type, name, identifier) {
        this._name = "";
        this._collection = [];
        this.type = type;
        if (name) {
            this._name = name;
        }
        if (identifier) {
            this._identifier = identifier;
        }
        else {
            // use UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }
    Object.defineProperty(MediaCollection.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        set: function (identifier) {
            this._identifier = identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaCollection.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaCollection.prototype, "collection", {
        get: function () {
            return this._collection;
        },
        set: function (collection) {
            this._collection = collection;
        },
        enumerable: true,
        configurable: true
    });
    MediaCollection.prototype.addMedia = function (media) {
        this._collection = this._collection.concat(media);
    };
    MediaCollection.prototype.removeMedia = function (itemID) {
        if (itemID) {
            this._collection = this._collection.filter(function (media) {
                return media.identifier !== itemID;
            });
        }
    };
    return MediaCollection;
}());
//# sourceMappingURL=media-manager.js.map