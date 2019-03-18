package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"go.mongodb.org/mongo-driver/x/bsonx"
)

const dbname string = "bearchild"            // database name
const collectionRecord string = "record"     // lv, score record collection name
const collectionPlayer string = "player"     // player collection name
const dbuser string = "root"                 // database username
const dbpw string = "88888888"               // database password
const dburl string = "mongodb://mongo:27017" // database url

var client *mongo.Client

func Connect() error {
	var err error
	cdt := options.Credential{Username: dbuser, Password: dbpw}
	client, err = mongo.NewClient(options.Client().ApplyURI(dburl).SetAuth(cdt))
	if err != nil {
		log.Println(err)
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func Ping() error {
	log.Println("ping url", dburl)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	err := client.Ping(ctx, readpref.Primary())
	if err != nil {
		return err
	}
	return nil
}

func GetAllPlayer(results *[]bson.M) error {
	collection := client.Database(dbname).Collection(collectionPlayer)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	cur, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		return err
	}
	defer cur.Close(context.Background())

	for cur.Next(ctx) {
		var result bson.M
		err := cur.Decode(&result)
		if err != nil {
			return err
		}
		*results = append(*results, result)
	}
	if err := cur.Err(); err != nil {
		return err
	}
	return nil
}

func ShowDatabases() ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	dbs, err := client.ListDatabaseNames(ctx, bsonx.Doc{})
	if err != nil {
		return nil, err
	}
	return dbs, nil
}

func FindUid(uid int, create int64, result *DBPlayer) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := client.Database(dbname).Collection(collectionPlayer)
	filter := bson.M{"uid": uid, "create": create}
	if err := collection.FindOne(ctx, filter).Decode(&result); err != nil {
		return err
	}
	return nil
}

func GetPlayerCounter(counter *DBPlayerCounter) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := client.Database(dbname).Collection(collectionPlayer)
	filter := bson.M{"key": "counter"}
	if err := collection.FindOne(ctx, filter).Decode(&counter); err != nil {
		result, err := collection.InsertOne(ctx, DBPlayerCounter{Key: "counter", Count: 0})
		if err != nil {
			return err
		}
		log.Println(" Gen player result: ", result)
	}
	return nil
}

func UpdatePlayerCounter(dbCount int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := client.Database(dbname).Collection(collectionPlayer)
	filter := bson.M{"key": "counter"}
	update := bson.M{"$set": bson.M{"count": dbCount}}
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return errors.New(fmt.Sprintf("Update counter fail: %s\n", err))
	}
	log.Println("Update counter result ", result)

	return nil
}

func GenPlayer(newUid int) (int, int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := client.Database(dbname).Collection(collectionPlayer)
	create := time.Now().Unix()
	result, err := collection.InsertOne(ctx, DBPlayer{Uid: newUid, Create: create})
	if err != nil {
		return 0, 0, errors.New(fmt.Sprintf("Insert new player error: %s\n", err))
	}
	log.Println("InsertOne", result)
	log.Printf("Gen player uid:%d, create:%d\n", newUid, create)
	return newUid, create, nil
}

func UpdateRecord(r *DBRecord) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collection := client.Database(dbname).Collection(collectionRecord)

	filter := bson.M{"uid": r.Uid}
	update := bson.M{"$set": bson.M{"uid": r.Uid, "lv": r.Lv, "score": r.Score}}
	upsert := true
	option := options.UpdateOptions{Upsert: &upsert}
	if result, err := collection.UpdateOne(ctx, filter, update, &option); err != nil {
		return err
	} else {
		log.Println(result)
		return nil
	}
}
