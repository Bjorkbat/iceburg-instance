/*
 * Seperate file for managing account sessions for the app
 * * * * */

package accounts

import (
  "crypto/aes"
  "crypto/cipher"
  "crypto/rand"
  "crypto/sha256"
  "encoding/base64"
  "fmt"
  "io"

  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/models/session"
)

// TODO: Come up with a better way of setting up keys.  Namely, have a script
// change this part to some random value right before compilation.  Hell, then
// no one would know the key
const AES_KEY = "KfiubrHiLTHb3eIf"

// Function that creates session and returns the id.  Used exclusively by
// the login function that's also inside the accounts package
func CreateSession(username string) (string, error){

  // Encrypt the username
  userCipher, err := encryptUsername(username)
  if err != nil {
    fmt.Println(err)
    return "", err
  }

  // Generate a random 32 byte base64 string, i.e. the session id
  sessionId := make([]byte, 32)
  _, err = rand.Read(sessionId)
  if err != nil {
    fmt.Println(err)
    return "", err
  }

  // Generate a hash of the session id, which is the actual bit that
  // gets stored inside the database
  shaHash := sha256.New()
  shaHash.Write(sessionId)
  sessionHash := base64.URLEncoding.EncodeToString(shaHash.Sum(nil))

  // Now, store the encrypted username and the hashed session id inside the
  // database
  qString := session.GenInsert(sessionHash, string(userCipher))
  _, err = database.Execute(qString)
  if err != nil {
    fmt.Println(err)
    return "", err
  }

  // So, the new session has been stored.  Return the unhashed sessionId string
  // back to the calling function, i.e the LoginHandler
  return string(sessionId), nil
}

// Function that takes as input a session id and authenticates it
func AuthSession(id string){
  return
}

// Encryption is messy and takes a lot to setup, so it's isolate in it's own
// private function
func encryptUsername(username string) ([]byte, error) {
  // First, we need to generate a new AES-128 cipher

  block, err := aes.NewCipher([]byte(AES_KEY))
  if err != nil {
    fmt.Println(err)
    return nil, err
  }

  // Now then, convert the username to a byte array, and add enough padding
  // such that the plaintext is a multiple of the block size
  plaintext := []byte(username)
  padcount := len(plaintext) % block.BlockSize()
  padding := make([]byte, padcount)
  for i := 0; i < padcount; i ++ {
    padding[i] = '='
  }
  plaintext = append(plaintext, padding...)
  fmt.Println("Plaintext plus padding: " + string(plaintext))

  // Go ahead and declare a byte slice for the ciphertext, but leave enough
  // room for the IV to add to the front
  ciphertext := make([]byte, block.BlockSize() + len(plaintext))
  iv := ciphertext[:block.BlockSize()]
  _, err = io.ReadFull(rand.Reader, iv)
  if err != nil {
    fmt.Println(err)
    return nil ,err
  }

  // Finally, get a new Cipher Block Chain encrypter
  blockMode := cipher.NewCBCEncrypter(block, iv)
  blockMode.CryptBlocks(ciphertext[block.BlockSize():], plaintext)

  // For fucks sake, finally.  Return the ciphertext, but remember, you're
  // anything but done writing security here
  return ciphertext, nil
}
