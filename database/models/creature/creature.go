/*
 * Package for describing the creature model.  Basically, any creature that
 * exists in the world is stored inside this table
 * * * * */

package creature

// Initialization string function
func GetInit() string {

  // Pretty simple.  Just store the type of creatures that exist, and how many.
  // Because creatures are constantly moving, storing things like position
  // isn't necessary.
  var qString string = "CREATE TABLE IF NOT EXISTS creature ( " +
  "type VARCHAR(255) PRIMARY KEY, " +
  "count INTEGER NOT NULL);"

  return qString
}

// Special insert function.  If the creature type can't be found in the table,
// Then a simple insert is performed.  Else, peform an update
func GenInsert(creature string, count string) string{
  var qString string = "INSERT INTO creature (type, count) VALUES ( " +
  "'" + creature + "' , " +
  count + " ) " +
  "ON DUPLICATE KEY UPDATE count=" + count + ";"

  return qString
}

// TODO: Function to remove all types of a monster
