/*
 * Model for users.  Will probably grow more complex in time
 * * * * */

package user

func GetInit() string {
  var qString string = "CREATE TABLE IF NOT EXISTS user (" +
    "id INTEGER AUTO_INCREMENT PRIMARY KEY, " +
    "username VARCHAR(32) NOT NULL UNIQUE, " +
    "email VARCHAR(255) NOT NULL UNIQUE, " +
    "password VARCHAR(44) NOT NULL, " +
    "salt VARCHAR(44) NOT NULL )"

  return qString
}

// Generates an insert string for a new user
func GenInsert(username string, email string, saltedpass string, salt string) string {
  insertString := "INSERT INTO user (username, email, password, salt) VALUES ( " +
    "'" + username + "', " +
    "'" + email + "', " +
    "'" + saltedpass + "', " +
    "'" + salt + "' )"

  return insertString
}
