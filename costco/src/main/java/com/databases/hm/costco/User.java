package com.databases.hm.costco;

/**
 * Class to store current user of the system that is logged in
 */
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
}
