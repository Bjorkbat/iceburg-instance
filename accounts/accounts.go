/*
 * Package for handling things like logging in and signing up
 * * * * */

package accounts

import (
  "crypto/rand"
  "crypto/sha256"
  "database/sql"
  "encoding/base64"
  "fmt"
  "html/template"
  "net/http"

  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/models/user"
)

type FormError struct {
  ErrorType string
  ErrorDesc string
}

// TODO: Add regex url parsing

var templates *template.Template

func InitTemplates() {
  templates = template.Must(template.ParseFiles(
    "templates/accounts/login.html",
    "templates/accounts/signup.html",
    "templates/accounts/signup_success.html",
    "templates/partials/header.html",
    "templates/partials/footer.html" ))
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {

  if r.Method == "GET" {
    templates.ExecuteTemplate(w, "login.html", nil)
    return
  } else if r.Method != "POST" {
    // Todo, raise some sort of permissions error
  }

  // So, it's a post request.  Extract the user model with their username
  username := r.FormValue("username")
  qString := user.GetGet("username")
  u := user.UserModel{}
  err := database.QueryRow(qString, username).Scan(&u.Username, &u.Email, &u.Password, &u.Salt)
  if err == sql.ErrNoRows {
    // The username didn't get anything from the users, meaning they entered
    // the wrong username.  Return form error
    fmt.Println(err)
    return
  } else if err != nil {
    // Something more interesting happened.  Raise a 500 error instead
    fmt.Println(err)
    return
  }

  // So, we got the user data back.  Take the password passed in through the
  // form, hash it with the salt in the model, and compare.  If the two are
  // the same then the user is authenticated
  formPass := r.FormValue("password")
  hasher := sha256.New()
  // Note, this might fail, as the salt might need to be decoded out of base64
  // I doubt that though.  Bytes are bytes
  decodedSalt, err := base64.URLEncoding.DecodeString(u.Salt)
  if err != nil {
    // Decoder error.  Return 500
    fmt.Println(err)
    return
  }
  hasher.Write(append( []byte(formPass), decodedSalt... ))
  hashedPass := base64.URLEncoding.EncodeToString(hasher.Sum(nil))

  if hashedPass == u.Password {
    // Success
    fmt.Println("Success!")
  } else {
    // Fail
    fmt.Println("fail")
  }

  // TODO: Generate a session key for the user.  For now though, I'm satisfied
  // with just seeing if my system works

}

func SignUpHandler(w http.ResponseWriter, r *http.Request) {

  // Check the method.  If GET, then just render template
  if r.Method == "GET" {
    templates.ExecuteTemplate(w, "signup.html", nil)
    return
  } else if r.Method != "POST" {
    // Only get and posts mate
    // TODO: return permission error
  }

  // TODO: Create validation functions to ensure form data passes certain
  // parameters
  username := r.FormValue("username")
  email := r.FormValue("email")
  password := r.FormValue("password")
  password_again := r.FormValue("password_again")

  if password != password_again {
    // Bring the template back up and pass in the errors
    formError := FormError{"Password", "The passwords didn't match"}
    templates.ExecuteTemplate(w, "signup.html", formError)
    return
  }

  // The fun part.  Start with getting the salt
  salt := make([]byte, 32)
  _, err := rand.Read(salt)
  if err != nil {
    http.Error(w, "Couldn't create account.  Try again later",
      http.StatusInternalServerError)
    return
  }

  // Now use the salt to make salted passwd hash
  shaHash := sha256.New()
  shaHash.Write(append( []byte(password), salt... ))
  saltedPass := base64.URLEncoding.EncodeToString(shaHash.Sum(nil))

  // Now insert the new user into the database
  insertString := user.GenInsert(
    username,
    email,
    saltedPass,
    base64.URLEncoding.EncodeToString(salt))

  _, err = database.Execute(insertString)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  templates.ExecuteTemplate(w, "signup_success.html", nil)
  return
}
