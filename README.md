#iceburg-instance
================

Iceburg is a game about exploring the internet.  I'll write more later, I should probably go into setup

##Setup

First, I'm going to assume you've never worked with Go before, and probably don't have a workspace setup
for Go.  Let's take care of that.  The link below goes into all the nitty gritty of writing Go code, including
the workspace setup...

https://golang.org/doc/code.html

... but that's a lot of reading.

So, basically, for the sake of getting things up and running, you're going to need to setup a directory structure
like so.  Also, I'm going to assume you've installed the Go compiler on your machine already

(your go workspace root, name it whatever)
  - src
    - github.com
      - iceburg-instance (this repo, ya dingus)
  - pkg
  - bin
  
Technically not the proper proper way.  Whatever.  I'll fix that later.

So, you have your workspace setup.  Now you have to set the `$GOPATH` variable inside your bash config.  `$GOPATH`
is set to wherever the hell your Go workspace root is.  I like to keep mind in my $HOME directory and call it
`golang`, so in my case I would add `export GOPATH=$HOME/golang` to my `.bash_profile`.

Almost done.  Iceburg relies on an external library called `go-sql-driver` in order to interact with the database.
Once again, I'm assuming you haven't worked with Go in detail.  To get this external library, just go to your Go
root (try refreshing your terminal and doing `cd $GOPATH`) and type `go get github.com/go-sql-driver/mysql`.  Viola,
Go has downloaded the external library and is ready for use.

Now you're finally ready to compile and play around with the Iceburg server.  Navigate theyself to the root of this
project and run `go build main.go`, and with any luck you should get an executable.  Run main with the `runserver`
argument (as in `./main runserver`) and the server will run on :8080.  If you want to fiddle with the database you'll
need to setup a mysql database (check `db_settings.go` for default db values, and to change them if you want), then
run `initdb` to initialize the necessary tables.

If you run into any problems, then go away dammit (not really)
