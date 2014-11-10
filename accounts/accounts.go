/*
 * Package for handling things like logging in and signing up
 * * * * */

package accounts

import (
  "crypto/rand"
  "crypto/sha256"
  "encoding/base64"
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
  templates.ExecuteTemplate(w, "login.html", nil)
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
