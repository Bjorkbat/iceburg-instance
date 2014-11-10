/*
 * Model for users.  Will probably grow more complex in time
 * * * * */

package user

func GetInit() string {
  var qString string = "CREATE TABLE IF NOT EXISTS user (" +
    "id INTEGER AUTO_INCREMENT PRIMARY KEY, " +
    "username VARCHAR(48) NOT NULL UNIQUE, " +
    "email VARCHAR(255) NOT NULL UNIQUE, " +
    "password VARCHAR(44) NOT NULL, " +
    "salt VARCHAR(44) NOT NULL )"

  return qString
}
