/*
 * Model for users.  Will probably grow more complex in time
 * * * * */

package user

type UserModel struct {
  Username string
  Email string
  Password string
  Salt string
}

func GetInit() string {
  var qString string = "CREATE TABLE IF NOT EXISTS user (" +
    "username VARCHAR(32) PRIMARY KEY, " +
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

// Looking past how absurd the name is, what this function does is return a
// string that grabs only one model from the database using the param
// included as arg (will expand as see fit)
// Really don't need to retrieve ALL the things.  Blast it
func GetGet(column string) string {
  var qString string = "SELECT * FROM user WHERE " + column + " =?"
  return qString
}
