import localForage from "localforage";
import "reflect-metadata";
import {
    classToPlain,
    plainToClassFromExist,
    Expose, Type
} from "class-transformer";


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
    @Expose()
    get identifier(): string {
        return this._identifier;
    }

    set identifier(identifier: string) {
        this._identifier = identifier;
    }

    @Expose()
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    @Expose()
    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    @Expose()
    get pictureLocation(): string {
        return this._pictureLocation;
    }

    set pictureLocation(pictureLocation: string) {
        this._pictureLocation = pictureLocation;
    }

    @Expose()
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

    @Expose()
    get author(): string {
        return this._author;
    }

    set author(author: string) {
        this._author = author;
    }

    @Expose()
    @Type(() => Number)
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

    @Expose()
    get director(): string {
        return this._director;
    }

    set director(director: string) {
        this._director = director;
    }

    @Expose()
    get duration(): string {
        return this._duration;
    }

    set duration(duration: string) {
        this._duration = duration;
    }

    @Expose()
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
    private readonly _type: Function;

    constructor(
        type: Function,
        name?: string,
        identifier?: string,
    ) {
        this._type = type;

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

    @Expose()
    get identifier(): string {
        return this._identifier;
    }

    set identifier(identifier: string) {
        this._identifier = identifier;
    }

    @Expose()
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    @Expose()
    @Type(options => {
        if (options) {
            return (options.newObject as MediaCollection<T>)._type
        } else {
            throw new Error("cannot determine the type because the options object is null or undefined");
        }
    })
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

// isolate persistence concerns in the service layer by implementing the service interface
// functionally decomposing our application
interface MediaService<T extends Media> {
    loadMediaCollection(identifier: string): Promise<MediaCollection<T>>;
    saveMediaCollection(collection: Readonly<MediaCollection<T>>): Promise<void>;
    getMediCollectionIdentifiersList(): Promise<string[]>;
    removeMediaCollection(identifier: string): Promise<void>;
}

// create an implementation of the MediaService interface
class MediaServiceImpl<T extends Media> implements MediaService<T> {
    private readonly _store: LocalForage;

    constructor(private _type: Function) {
        console.log(`Initializing the media service for ${_type.name}`);

        // each instance of the media has its own datastore
        // consult https://github.com/localForage/ to read more.
        this._store = localForage.createInstance({
            name: "mediaManager",
            version: 1.0,
            storeName: `media-manager-${_type.name}`,
            description: "MediaManager data store",
        })
    }

    saveMediaCollection(collection: Readonly<MediaCollection<T>>): Promise<void> {
        // there won't be a value coming out of the promise upon resolution
        // (that is, it will just be a signal).
        return new Promise((resolve, reject) => {
            if (!collection) {
                reject(new Error("The collection cannot be null or undefined"));
            }

            console.log(`saving media collection with the name ${collection.name}`);
            // We use classToPlain to serialize the MediaCollection object:
            // Note that we use the excludePrefixes option in order to exclude all properties
            // whose name starts with an underscore in order to avoid exposing our private
            // properties directly (for example, _name in the Media class).
            const serializedVersion = classToPlain(collection, {
                excludePrefixes: ["_"]
            });

            this._store.setItem(collection.identifier, serializedVersion)
                .then(value => {
                    console.log(`saved the ${collection.name} collection successfully
                    Saved value: ${value}`);
                    resolve();
                })
                .catch(err => {
                    console.error(`Failed to save the ${collection.name}
                    collection with identifier ${collection.identifier}.
                    Error: ${err}`)
                    reject(err);
                })
        });
    }

    loadMediaCollection(identifier: string): Promise<MediaCollection<T>> {
        console.log(`trying to load the media collection with identifier ${identifier}`);

        return new Promise((resolve, reject) => {
            this._store.getItem(identifier)
                .then(value => {
                    console.log(`found the collection: ${value} `);

                    // deserialize the data
                    const retrievedCollection = plainToClassFromExist<MediaCollection<T>, any>(new MediaCollection<T>(this._type), value);

                    console.log(`retrieved collection: ${retrievedCollection}`);
                    resolve(retrievedCollection);
                })
                .then(err => {
                    reject(err);
                });
        });
    }

    getMediCollectionIdentifiersList(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            console.log("retrieving list of media collection identifiers");

            this._store.keys()
                .then(keys => {
                    console.log(`successfully retrieved the media collection
                    identifiers: ${keys}`);
                    resolve(keys);
                })
                .catch(err => {
                    console.log(`Failed to retrieve the list of media collection identifiers.
                         Error: ${err}`);
                    reject(err);
                });
        });
    }

    removeMediaCollection(identifier: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error("identifier must be provided"));
            }

            console.log(`removing this identifier ${identifier} from media collections`);
            this._store.removeItem(identifier)
                .then(() => {
                    console.log("identifier removed successfully");
                    resolve();
                })
                .catch(err => {
                    console.error("failed to remove the identifier");
                    reject(err);
                });
        });
    }
}
