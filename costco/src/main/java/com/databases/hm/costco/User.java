package com.databases.hm.costco;

import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.springframework.web.bind.annotation.*;
import static com.mongodb.client.model.Updates.*;

import java.util.Arrays;

import static com.mongodb.client.model.Filters.eq;


/**
 * Class to store current user of the system that is logged in
 */
@RestController()
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class User {
    private static String username;

    public User() {
    }

    public static void setUser(String username) {
        User.username = username;
    }
    public static String getUser() {
        return username;
    }

    @PutMapping("/change_password")
    public boolean changePassword(@RequestParam String old_password,
                                         @RequestParam String new_password) {
        MongoCollection<Document> users = MongoController.getClient()
                .getDatabase("costco").getCollection("users");

        Document result = users.aggregate(Arrays.asList(
                new Document("$match",
                        new Document("username", username)))).first();

        if (result == null || !result.getString("password").equals(old_password)) {
            return false;
        }
        users.updateOne(eq("username", username), set("password", new_password));
        return true;
    }
}
