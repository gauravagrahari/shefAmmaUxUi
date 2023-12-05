import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('imageUrls.db');

// Initialize the database
const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, imgPath TEXT NOT NULL, url TEXT NOT NULL);',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Insert or update an image URL
const storeImageUrl = (imgPath, url) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR REPLACE INTO images (imgPath, url) VALUES (?, ?);',
        [imgPath, url],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// Retrieve an image URL
const getImageUrl = (imgPath) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT url FROM images WHERE imgPath = ?;',
        [imgPath],
        (_, { rows }) => resolve(rows._array.length > 0 ? rows._array[0].url : null),
        (_, error) => reject(error)
      );
    });
  });
};

export { init, storeImageUrl, getImageUrl };
