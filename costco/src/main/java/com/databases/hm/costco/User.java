package com.databases.hm.costco;

import java.util.List;
import java.util.Map;

/**
 * Class to store current user of the system that is logged in
 */
public class User {
    private static String username;
    private static Map<String, Double[]> num_filters;


    public User() {

    }

    public static void setUser(String username) {
        User.username = username;
    }
    public static String getUser() {
        return username;
    }
}
