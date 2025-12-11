package com.databases.hm.costco;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController()
@RequestMapping("/filters")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class Filter {
    private static Map<String, double[]> num_filters;
    private static List<String> categories;

    public Filter() {
        categories = new ArrayList<>();
        num_filters = new HashMap<>(Map.ofEntries(
                Map.entry("Price", new double[]{0, Double.POSITIVE_INFINITY}),
                Map.entry("Discount", new double[]{0, Double.POSITIVE_INFINITY}),
                Map.entry("Rating", new double[]{0, Double.POSITIVE_INFINITY})));
    }

    public static Map<String, double[]> filterGetNums() {
        return num_filters;
    }
    @PutMapping("/lower/{field}")
    public void filterLowerBound(@PathVariable String field,
                                 @RequestParam double bound) {
        double upper_bound = num_filters.get(field)[1];
        num_filters.put(field, new double[]{bound, upper_bound});
    }
    @PutMapping("/upper/{field}")
    public void filterUpperBound(@PathVariable String field,
                                 @RequestParam double bound) {
        double lower_bound = num_filters.get(field)[0];
        num_filters.put(field, new double[]{lower_bound, bound});
    }

    public static List<String> filterGetCategories() {
        return categories;
    }
    @PutMapping("/categories/{category}")
    public void filterAddCategory(@PathVariable String category) {
        if (!categories.contains(category)) {
            categories.add(category);
        }
    }
    @DeleteMapping("/categories/{category}")
    public void filterRemoveCategory(@PathVariable String category) {
        categories.remove(category);
    }

    @DeleteMapping("/clear")
    public void filterClear() {
        categories.clear();
        for (String field : num_filters.keySet()) {
            num_filters.put(field,  new double[]{0, Double.POSITIVE_INFINITY});
        }
    }
}
