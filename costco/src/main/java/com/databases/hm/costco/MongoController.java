package com.databases.hm.costco;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import static com.mongodb.client.model.Filters.*;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import org.springframework.web.bind.annotation.*;

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

    public static MongoClient getClient() {
        return client;
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

    @GetMapping("/search")
    public List<Document> search(@RequestParam(defaultValue = "") String item) {
        MongoCollection<Document> costco = client.getDatabase("costco").getCollection("costco");
        Map<String, double[]> num_filters = Filter.filterGetNums();
        List<String> keys = new ArrayList<>(num_filters.keySet());
        List<String> categories = Filter.filterGetCategories();

        AggregateIterable<Document> result = costco.aggregate(Arrays.asList(
                new Document("$match",
                        new Document("Title", new Document("$regex", item).append("$options", "i"))
                                .append(keys.getFirst(), new Document("$gte", num_filters.get(keys.getFirst())[0])
                                        .append("$lte", num_filters.get(keys.removeFirst())[1]))
                                .append(keys.getFirst(), new Document("$gte", num_filters.get(keys.getFirst())[0])
                                        .append("$lte", num_filters.get(keys.removeFirst())[1]))
                                .append(keys.getFirst(), new Document("$gte", num_filters.get(keys.getFirst())[0])
                                        .append("$lte", num_filters.get(keys.removeFirst())[1]))
                                .append("Category", new Document(categories.isEmpty() ? "$nin" : "$in", categories)))));
        return result.into(new ArrayList<>());
    }

}
