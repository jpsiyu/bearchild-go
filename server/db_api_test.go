package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/jpsiyu/bearchild-go/server/db"
	"go.mongodb.org/mongo-driver/bson"
)

func HandlerDBShowdbs(w http.ResponseWriter, r *http.Request) {
	dbs, err := db.ShowDatabases()
	if err != nil {
		w.Write([]byte(""))
		return
	}

	encode, err := json.Marshal(dbs)
	if err != nil {
		w.Write([]byte(""))
		return
	}
	w.Write([]byte(encode))
}

func HandlerDBAllPlayers(w http.ResponseWriter, r *http.Request) {
	results := []bson.M{}
	err := db.GetAllPlayer(&results)
	if err != nil {
		log.Println(err)
		w.Write([]byte(""))
		return
	}

	encode, err := json.Marshal(results)
	if err != nil {
		log.Println(err)
		w.Write([]byte(""))
		return
	}
	w.Write([]byte(encode))

}
