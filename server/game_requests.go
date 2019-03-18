package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/jpsiyu/bearchild-go/server/db"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Route into home handler with path: %s\n", r.URL.Path)
	indexPath := "dist/index.html"
	data, err := ioutil.ReadFile(indexPath)

	if err != nil {
		w.WriteHeader(404)
		w.Write([]byte("404 - " + http.StatusText(404)))
	} else {
		w.Write(data)
	}
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Route into not found handler with path: %s\n", r.URL.Path)
	w.WriteHeader(404)
	w.Write([]byte("404 - " + http.StatusText(404)))
}

func HandlerGetUid(w http.ResponseWriter, r *http.Request) {
	type ResData struct {
		Uid    int   `json:"uid"`
		Create int64 `json:"create"`
	}
	defaultData := ResData{Uid: 999, Create: 0}

	// check the parameter
	query := r.URL.Query()
	var uid int
	var create int64
	var err error
	log.Println(query.Get("uid"), query.Get("create"))
	uid, err = strconv.Atoi(query.Get("uid"))
	create, err = strconv.ParseInt(query.Get("create"), 10, 64)

	errFun := func(err error) {
		log.Println(err)
		encode, _ := json.Marshal(defaultData)
		w.Write([]byte(encode))
	}
	if err != nil {
		errFun(err)
		return
	}
	log.Printf("My uid is %d, create at %d\n", uid, create)

	// handle uid
	result := db.DBPlayer{}
	var serverUid int
	var serverCreate int64
	if err := db.FindUid(uid, create, &result); err != nil {
		serverUid, serverCreate, err = GameMgr.GenPlayerId()
		log.Printf("Gen new uid: %d", serverUid)
	} else {
		log.Println("Find user: ", result)
		serverUid = result.Uid
		serverCreate = result.Create
	}

	data := ResData{Uid: serverUid, Create: serverCreate}
	if encode, err := json.Marshal(data); err != nil {
		errFun(err)
		return
	} else {
		w.Write([]byte(encode))
	}
}

func HandlerGetRank(w http.ResponseWriter, r *http.Request) {
	rankList := GameMgr.GetRank()
	if len(*rankList) == 0 {
		w.Write([]byte("[]"))
		return
	}
	encode, err := json.Marshal(rankList)
	if err != nil {
		log.Println(err)
		w.Write([]byte(""))
	} else {
		w.Write(encode)
	}
}

func HandlerRecordUpdate(w http.ResponseWriter, r *http.Request) {
	errFun := func(err error) {
		log.Println(err)
		w.Write([]byte("fail"))
	}
	decoder := json.NewDecoder(r.Body)
	var rd db.DBRecord
	if err := decoder.Decode(&rd); err != nil {
		errFun(err)
		return
	}

	log.Printf("Uid %d update record with lv: %d and score: %d", rd.Uid, rd.Lv, rd.Score)
	if err := db.UpdateRecord(&rd); err != nil {
		errFun(err)
		return
	}

	GameMgr.AddRecord2Rank(&rd)
	w.Write([]byte("ok"))
}
