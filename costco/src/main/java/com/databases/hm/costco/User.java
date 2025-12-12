package com.databases.hm.costco;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import org.bson.BsonNull;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;
import static com.mongodb.client.model.Updates.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

    @PutMapping("/add_to_cart")
    public void addToCart(@RequestParam String itemId) {
        ObjectId item = new ObjectId(itemId);
        MongoCollection<Document> users = MongoController.getClient()
                .getDatabase("costco").getCollection("users");
        Document user = users.aggregate(Arrays.asList(
                new Document("$unwind", new Document("path", "$cart")),
                new Document("$match", new Document("username", username)
                        .append("cart.item_id", item)))).first();
        int quantity = 1;
        if  (user != null) {
            quantity = user.get("cart", Document.class).getInteger("quantity");
        }
        //TODO: update the item, not add an extra one
        users.updateOne(eq("username", username),
                push("cart", new Document("item_id", item)
                        .append("quantity", quantity)));
    }

    @GetMapping("/cart_items")
    public List<Document> getCartItems(@RequestParam String username) {
        MongoCollection<Document> users = MongoController.getClient()
                .getDatabase("costco").getCollection("users");

        AggregateIterable<Document> result = users.aggregate(Arrays.asList(new Document("$match",
                        new Document("username", username)),
                new Document("$unwind", "$cart"),
                new Document("$group",
                        new Document("_id", "$cart.item_id")
                                .append("quantity",
                                        new Document("$sum", 1L))),
                new Document("$lookup",
                        new Document("from", "costco")
                                .append("localField", "_id")
                                .append("foreignField", "_id")
                                .append("as", "product")),
                new Document("$unwind", "$product")));

        // Collect all aggregated documents into a list
        List<Document> list = new ArrayList<>();
        for (Document doc : result) {
            list.add(doc);
        }

        // Convert ObjectId to hex string if needed
        for (Document doc : list) {
            if (doc.get("_id") instanceof ObjectId) {
                doc.put("_id", doc.getObjectId("_id").toHexString());
            }
        }

        return list;
    }

    @PostMapping("/place_order")
    public double placeOrder() {
        MongoCollection<Document> users = MongoController.getClient()
                .getDatabase("costco").getCollection("users");

        AggregateIterable<Document> result = users.aggregate(Arrays.asList(new Document("$match",
                        new Document("username", username)),
                new Document("$unwind",
                        new Document("path", "$cart")),
                new Document("$group",
                        new Document("_id", "$cart.item_id")
                                .append("quantity",
                                        new Document("$count",
                                                new Document()))),
                new Document("$lookup",
                        new Document("from", "costco")
                                .append("localField", "_id")
                                .append("foreignField", "_id")
                                .append("as", "product")),
                new Document("$unwind",
                        new Document("path", "$product")),
                new Document("$addFields",
                        new Document("total",
                                new Document("$multiply", Arrays.asList("$product.Price", "$quantity")))),
                new Document("$group",
                        new Document("_id",
                                new BsonNull())
                                .append("total",
                                        new Document("$sum", "$total")))));

        double total = result.first().getDouble("total");
        addOrder(total);
        users.updateOne(eq("username", username),
                set("cart", List.of()));

        return total;

    }

    @GetMapping("/num_orders")
    public int getNumOrders(@RequestParam String username) {
        MongoCollection<Document> orders = MongoController.getClient()
                .getDatabase("costco").getCollection("orders");
        AggregateIterable<Document> result = orders.aggregate(Arrays.asList(new Document("$match",
                        new Document("username", username)),
                new Document("$count", "orderId")));

//        int total = result.first().getInteger("orderId");

        return result.first().getInteger("orderId");
    }

//    @GetMapping("/total_spent")
//    public double getTotalSpent(@RequestParam String username) {
//        //todo
//    }

    private static void addOrder(double total) {
        MongoCollection<Document> users = MongoController.getClient()
                .getDatabase("costco").getCollection("users");
        MongoCollection<Document> orders = MongoController.getClient()
                .getDatabase("costco").getCollection("orders");

        AggregateIterable<Document> result = users.aggregate(Arrays.asList(new Document("$match",
                        new Document("username", username)),
                new Document("$unwind",
                        new Document("path", "$cart")),
                new Document("$group",
                        new Document("_id", "$cart.item_id")
                                .append("quantity",
                                        new Document("$count",
                                                new Document()))),
                new Document("$lookup",
                        new Document("from", "costco")
                                .append("localField", "_id")
                                .append("foreignField", "_id")
                                .append("as", "product")),
                new Document("$unwind",
                        new Document("path", "$product"))));

        List<Document> cart = result.into(new ArrayList<>());
        List<Document> items = new ArrayList<>();
        for (Document item : cart) {
            Document doc =  new Document("_id", item.getObjectId("_id"))
                    .append("quantity", item.getInteger("quantity"));
            items.add(item);
        }
        Document order = new Document("_id", new ObjectId())
                .append("username", username)
                .append("items", items)
                .append("total", total);
        orders.insertOne(order);
    }
}
