/*
 * Package for managing sessions.  Not really models per say, but for the sake
 * of simplicity they're models dammit
 * * * * */

package session

// Simple.  Store a random (but unique) 16 byte base64 string in the id field
// Don't use a foreign key assocation, as that would make it too easy.  Encrypt
// the username using AES Chain Block Cipher.  The IV is stored at the front.
// Finally, include a timestamp.  Because it's impossible to query by username,
// it's basically impossible to update session values.  So, timestamp them,
// continuously create new sessions, and set up a cron job to delete sessions
// older than a max age
func GetInit() string {
  var qString string = "CREATE TABLE IF NOT EXISTS session (" +
    "id VARCHAR(44) PRIMARY KEY, " +
    "usercipher VARCHAR(32) NOT NULL UNIQUE, " +
    "timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL )"

  return qString
}

// Generates an insert string for storing a new session
func GenInsert(id string, usercipher string) string {
  insertString := "INSERT INTO user (id, usercipher) VALUES ( " +
    "'" + id + "', " +
    "'" + usercipher + "' )"

  return insertString
}
