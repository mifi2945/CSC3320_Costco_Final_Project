package com.databases.hm.costco;

import java.util.Arrays;
import java.util.List;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import static com.mongodb.client.model.Filters.*;
import org.bson.types.ObjectId;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MongoController {
    @GetMapping("/login")
    public boolean login(@RequestParam String username, @RequestParam String password) {
        String db_user = System.getenv("MONGO_USER");
        String db_pw = System.getenv("MONGO_PW");
        String uri = "mongodb+srv://"+db_user+":"+db_pw+"@cluster-part1.adrc0k9.mongodb.net/";
        try (MongoClient client = MongoClients.create(uri)) {
            System.out.println("=> Connection successful");

            MongoCollection<Document> users = client.getDatabase("costco").getCollection("users");
            System.out.println("=> Collection connected");

            Document result = users.find(eq("username", username)).first();
            // if user exists, check password match
            if (result == null) {
                // create user
                Document user = new Document("_id", new ObjectId())
                        .append("username", username)
                        .append("password", password);
                users.insertOne(user);
            } else {
                // user exists, check password
                return result.getString("password").equals(password);
            }
        } catch (Exception e) {
            System.err.println("Something went really wrong... " + e.getMessage());
            return false;
        }
        return false;
    }
}
