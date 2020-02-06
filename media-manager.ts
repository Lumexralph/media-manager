enum Genre {
    Horror = "Horror",
    Fantastic = "Fantastic",
    Thriller = "Thriller",
    Romance = "Romance",
    Fiction = "Fiction",
}

// base media representation for the project
abstract class Media {
    private _identifier: string;

    protected constructor(
        private _name: string,
        private _description: string,
        private _genre: Genre,
        private _pictureLocation: string,
        identifier?: string,
    ) {
        if (identifier) {
            this._identifier = identifier;
        } else {
            // use UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }

    // since we've private fields, we access them using the accessors
    // getters and setters
    get identifier(): string {
        return this._identifier;
    }

    set identifier(identifier: string) {
        this._identifier = identifier;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get genre(): Genre {
        return this._genre;
    }

    set genre(genre: Genre) {
        this._genre = genre;
    }
}

// our book
class Book extends Media {
    private _author: string;
    private _numberOfPages: number;

    constructor(
        name: string,
        description: string,
        pictureLocation: string,
        genre: Genre,
        author: string,
        numberOfPages: number,
        identifier?: string,
    ) {
        super(
            name,
            description,
            genre,
            pictureLocation,
            identifier
        );
        this._author = author;
        this._numberOfPages = numberOfPages;
    }

    get author(): string {
        return this._author;
    }

    set author(author: string) {
        this._author = author;
    }

    get numberOfPages(): number {
        return this._numberOfPages;
    }

    set numberOfPages(numberOfPages: number) {
        this._numberOfPages = numberOfPages;
    }
}

enum IMDBRating {
    veryPoor = 1,
    Poor,
    Good,
    VeryGood,
    Excellent,
}

// our movie, another type of media
class Movie extends Media {
    private _duration: string;
    private _director: string;
    private _imdbRating: IMDBRating;

    constructor(
        name: string,
        description: string,
        pictureLocation: string,
        genre: Genre,
        duration: string,
        director: string,
        imdbRating: IMDBRating,
        identifier?: string,
    ) {
        super(
            name,
            description,
            genre,
            pictureLocation,
            identifier
        );

        this._director = director;
        this._duration = duration;
        this._imdbRating = imdbRating;
    }

    get director(): string {
        return this._director;
    }

    set director(director: string) {
        this._director = director;
    }

    get duration(): string {
        return this._duration;
    }

    set duration(duration: string) {
        this._duration = duration;
    }

    get imdbRating(): IMDBRating {
        return this._imdbRating;
    }

    set imdbRating(imdbRating: IMDBRating) {
        this._imdbRating = imdbRating;
    }
}

// MediaCollection of only Media types using Generics
class MediaCollection<T extends Media> {
    private _identifier: string;
    private _name: string = "";
    private _collection: ReadonlyArray<T> = [];
    private readonly type: Function;

    constructor(
        type: Function,
        name?: string,
        identifier?: string,
    ) {
        this.type = type;

        if (name) {
            this._name = name;
        }

        if (identifier) {
            this._identifier = identifier;
        } else {
            // use UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = Math.random().toString(36).substr(3, 10);
        }
    }

    get identifier(): string {
        return this._identifier;
    }

    set identifier(identifier: string) {
        this._identifier = identifier;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get collection(): ReadonlyArray<T> {
        return this._collection;
    }

    set collection(collection: ReadonlyArray<T>) {
        this._collection = collection;
    }

    addMedia(media: Readonly<T>): void {
        this._collection = this._collection.concat(media);
    }

    removeMedia(itemID: string) {
        if (itemID) {
            this._collection = this._collection.filter(media => {
                return media.identifier !== itemID;
            });
        }
    }
}