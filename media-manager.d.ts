declare enum Genre {
    Horror = "Horror",
    Fantastic = "Fantastic",
    Thriller = "Thriller",
    Romance = "Romance",
    Fiction = "Fiction"
}
declare abstract class Media {
    private _name;
    private _description;
    private _genre;
    private _pictureLocation;
    private _identifier;
    protected constructor(_name: string, _description: string, _genre: Genre, _pictureLocation: string, identifier?: string);
    get identifier(): string;
    set identifier(identifier: string);
    get name(): string;
    set name(name: string);
    get description(): string;
    set description(description: string);
    get genre(): Genre;
    set genre(genre: Genre);
}
declare class Book extends Media {
    private _author;
    private _numberOfPages;
    constructor(name: string, description: string, pictureLocation: string, genre: Genre, author: string, numberOfPages: number, identifier?: string);
    get author(): string;
    set author(author: string);
    get numberOfPages(): number;
    set numberOfPages(numberOfPages: number);
}
declare enum IMDBRating {
    veryPoor = 1,
    Poor = 2,
    Good = 3,
    VeryGood = 4,
    Excellent = 5
}
declare class Movie extends Media {
    private _duration;
    private _director;
    private _imdbRating;
    constructor(name: string, description: string, pictureLocation: string, genre: Genre, duration: string, director: string, imdbRating: IMDBRating, identifier?: string);
    get director(): string;
    set director(director: string);
    get duration(): string;
    set duration(duration: string);
    get imdbRating(): IMDBRating;
    set imdbRating(imdbRating: IMDBRating);
}
declare class MediaCollection<T extends Media> {
    private _identifier;
    private _name;
    private _collection;
    private readonly type;
    constructor(type: Function, name?: string, identifier?: string);
    get identifier(): string;
    set identifier(identifier: string);
    get name(): string;
    set name(name: string);
    get collection(): ReadonlyArray<T>;
    set collection(collection: ReadonlyArray<T>);
    addMedia(media: Readonly<T>): void;
    removeMedia(itemID: string): void;
}
interface MediaService<T extends Media> {
    loadMediaCollection(identifier: string): Promise<MediaCollection<T>>;
    saveMediaCollection(collection: Readonly<MediaCollection<T>>): Promise<void>;
    getMediCollectionIdentifiersList(): Promise<string[]>;
    removeMediaCollection(identifier: string): Promise<void>;
}
