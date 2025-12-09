package com.databases.hm.costco;

import java.util.Arrays;
import java.util.List;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import static com.mongodb.client.model.Filters.*;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import org.springframework.boot.jackson.autoconfigure.JacksonProperties;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class MongoController {
    private static MongoClient client;

    /**
     * Setup connection to project MongoDB cluster
     */
    public MongoController() {
        String db_user = System.getenv("MONGO_USER");
        String db_pw = System.getenv("MONGO_PW");
        String uri = "mongodb+srv://"+db_user+":"+db_pw+"@cluster-part1.adrc0k9.mongodb.net/";
        client = MongoClients.create(uri);
        System.out.println("=> Connection successful");
    }
    @GetMapping("/login")
    public boolean login(@RequestParam String username, @RequestParam String password) {
            MongoCollection<Document> users = client.getDatabase("costco").getCollection("users");

            Document result = users.find(eq("username", username)).first();
            // if user exists, check password match
            if (result == null) {
                // create user
                Document user = new Document("_id", new ObjectId())
                        .append("username", username)
                        .append("password", password);
                users.insertOne(user);

                User.setUser(username);
                return true;
            } else if (result.getString("password").equals(password)){
                // user exists, check password
                    User.setUser(username);
                    return true;
            } else return false;
    }

}
