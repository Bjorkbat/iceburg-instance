/*
 * Package for extracting creature data from the database and returning to the
 * calling function
 * * * * */

package assets

import (
  "github.com/iceburg-instance/database/models/creature"
)

type CreatureList struct {
  Creatures []creature.CreatureTuple
}

func GetCreatures() ( *CreatureList, err ) {

  // Generate string to extract all the creatures
  qString := creature.GenAll()
  rows, err := database.Query(qString)
  if err != nil {
    fmt.Println(err)
    return nil, err
  }
  defer rows.Close()

  var creatureSlice []creature.CreatureTuple
  var creatureTuple creature.CreatureTuple

  for rows.Next() {
    creatureTuple = creature.CreatureTuple{}
    if err := rows.Scan(&creatureTuple.Type, &creatureTuple.Count); err != nil {
      fmt.Println(err)
      return nil, err
    }
    creatureSlice = append(creatureSlice, creatureTuple)
  }

  // Create new HeightData struct using heightSlice
  return &CreatureList{Creatures: creatureSlice}, nil

}
