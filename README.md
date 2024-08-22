package com.cognizant.collector.DatabaseCollector.service;


import com.cognizant.collector.DatabaseCollector.Scheduler.SchedulerInfo;
import com.cognizant.collector.DatabaseCollector.beans.RTS.Defect;
import com.cognizant.collector.DatabaseCollector.beans.RTS.TestCase;
import com.cognizant.collector.DatabaseCollector.beans.RTS.Userstories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class DataTransferService {

    @Autowired
    @Qualifier("sourceMongoTemplate")
    private MongoTemplate sourceMongoTemplate;

    @Autowired
    @Qualifier("targetMongoTemplate")
    private MongoTemplate targetMongoTemplate;

    private static final int BATCH_SIZE = 2000; // Adjust batch size as needed

    // Map to store POJO classes for each collection
    private static final Map<String, Class<?>> COLLECTION_CLASSES = new HashMap<>();

    static {
        COLLECTION_CLASSES.put("Userstories", Userstories.class);
        COLLECTION_CLASSES.put("Defect", Defect.class);
        COLLECTION_CLASSES.put("testcase", TestCase.class);
    }

    // Define date format for parsing if `lastUpdated` is a String
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Adjust format as needed

    // Fetch and process data for Userstories
    public void transferUserstories() {
        System.out.println("Starting transfer for Userstories...");
        fetchAndProcessData("Userstories", Userstories.class);
        System.out.println("Transfer for Userstories completed.");
    }

    // Fetch and process data for Defect
    public void transferDefect() {
        System.out.println("Starting transfer for Defect...");
        fetchAndProcessData("Defect", Defect.class);
        System.out.println("Transfer for Defect completed.");
    }

    // Fetch and process data for TestCase
    public void transferTestCase() {
        System.out.println("Starting transfer for TestCase...");
        fetchAndProcessData("testcase", TestCase.class);
        System.out.println("Transfer for TestCase completed.");
    }

    // Fetch data from a collection in batches
    private <T> void fetchAndProcessData(String collectionName, Class<T> pojoClass) {
        int page = 0;
        List<T> batch;

        System.out.println("Fetching data from collection " + collectionName + "...");

        do {
            System.out.println("Fetching page " + page + " from collection " + collectionName + "...");
            batch = fetchDataBatch(collectionName, pojoClass, page, BATCH_SIZE);

            if (batch != null && !batch.isEmpty()) {
                // Print data to console
                printData(batch);

                // Process data
                System.out.println("Inserting/updating data in collection " + collectionName + "...");
                upsertData(collectionName, pojoClass, batch);

                System.out.println("Page " + page + " processed successfully.");
                page++;
            } else {
                System.out.println("No more data to fetch for collection " + collectionName + ".");
            }
        } while (batch != null && !batch.isEmpty());

        // Update scheduler info in the target database
        System.out.println("Updating scheduler info for collection " + collectionName + "...");
        updateSchedulerInfo(collectionName);
        System.out.println("Scheduler info updated for collection " + collectionName + ".");
    }

    // Fetch data batch from the source collection
    private <T> List<T> fetchDataBatch(String collectionName, Class<T> pojoClass, int page, int batchSize) {
        Query query = new Query().with(PageRequest.of(page, batchSize));
        return sourceMongoTemplate.find(query, pojoClass, collectionName);
    }

    // Print data to the console
    private <T> void printData(List<T> data) {
        if (data != null && !data.isEmpty()) {
            System.out.println("Printing " + data.size() + " documents:");
            data.forEach(item -> System.out.println(item.toString()));
        } else {
            System.out.println("No documents to print.");
        }
    }

    // Upsert data into the target collection based on the lastUpdated field
    private <T> void upsertData(String collectionName, Class<T> pojoClass, List<T> data) {
        if (data != null && !data.isEmpty()) {
            for (T item : data) {
                try {
                    String idField = "_id"; // Field name of the ID in your POJO
                    String lastUpdatedField = "lastUpdated"; // Field name for the last updated timestamp

                    Object idValue = getFieldValue(item, idField); // Get the _id value
                    Object lastUpdatedValue = getFieldValue(item, lastUpdatedField); // Get the lastUpdated value

                    Date lastUpdatedDate = parseDate(lastUpdatedValue);

                    Query query = new Query(Criteria.where(idField).is(idValue));

                    // Check for the existing document in the target collection
                    T existingDocument = targetMongoTemplate.findOne(query, pojoClass, collectionName);

                    if (existingDocument != null) {
                        Object existingLastUpdatedValue = getFieldValue(existingDocument, lastUpdatedField);
                        Date existingLastUpdatedDate = parseDate(existingLastUpdatedValue);

                        // If the source document's lastUpdated is newer
                        if (lastUpdatedDate != null &&
                                (existingLastUpdatedDate == null || lastUpdatedDate.after(existingLastUpdatedDate))) {

                            Map<String, Object> sourceFields = getFieldValues(item);
                            Map<String, Object> targetFields = getFieldValues(existingDocument);

                            // Remove fields that are not to be updated
                            sourceFields.remove(idField);
                            sourceFields.remove(lastUpdatedField);

                            // Check for changes
                            boolean hasChanges = false;
                            for (Map.Entry<String, Object> entry : sourceFields.entrySet()) {
                                String key = entry.getKey();
                                Object value = entry.getValue();
                                if (!Objects.equals(value, targetFields.get(key))) {
                                    hasChanges = true;
                                    break;
                                }
                            }

                            // Update only if there are actual changes
                            if (hasChanges) {
                                Update update = new Update();
                                sourceFields.forEach(update::set);

                                // Update lastUpdated with the value from source
                                update.set(lastUpdatedField, DATE_FORMAT.format(lastUpdatedDate));

                                targetMongoTemplate.upsert(query, update, collectionName);
                                System.out.println("Document with ID " + idValue + " updated in collection " + collectionName);
                            } else {
                                System.out.println("Document with ID " + idValue + " has no changes to update in collection " + collectionName);
                            }
                        } else {
                            System.out.println("Document with ID " + idValue + " is up-to-date in collection " + collectionName);
                        }
                    } else {
                        // If the document doesn't exist, insert it
                        item = setLastUpdatedField(item, lastUpdatedField, lastUpdatedDate);
                        targetMongoTemplate.insert(item, collectionName);
                        System.out.println("Document with ID " + idValue + " inserted into collection " + collectionName);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing document: " + e.getMessage());
                }
            }

            System.out.println("Successfully processed " + data.size() + " documents in collection " + collectionName);
        }
    }

    // Parse date from String or Date object
    private Date parseDate(Object dateObject) {
        if (dateObject instanceof Date) {
            return (Date) dateObject;
        } else if (dateObject instanceof String) {
            String dateString = (String) dateObject;
            if (dateString == null || dateString.trim().isEmpty()) {
                return null;
            }
            try {
                return DATE_FORMAT.parse(dateString);
            } catch (ParseException e) {
                System.err.println("Error parsing date: " + e.getMessage());
                return null;
            }
        }
        return null;
    }

    // Get the value of a specific field from the POJO
    private Object getFieldValue(Object item, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Field field = item.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(item);
    }

    // Get all field values of the POJO
    private <T> Map<String, Object> getFieldValues(T item) {
        Map<String, Object> fieldValues = new HashMap<>();
        Field[] fields = item.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true);
            try {
                fieldValues.put(field.getName(), field.get(item));
            } catch (IllegalAccessException e) {
                System.err.println("Error accessing field: " + e.getMessage());
            }
        }

        return fieldValues;
    }

    // Set the lastUpdated field to the provided date
    private <T> T setLastUpdatedField(T item, String lastUpdatedField, Date lastUpdatedDate) {
        try {
            Field field = item.getClass().getDeclaredField(lastUpdatedField);
            field.setAccessible(true);
            field.set(item, DATE_FORMAT.format(lastUpdatedDate));
        } catch (Exception e) {
            System.err.println("Error setting lastUpdated field: " + e.getMessage());
        }
        return item;
    }

    // Update scheduler info in the target database
    private void updateSchedulerInfo(String collectionName) {
        Query query = new Query(Criteria.where("collectionName").is(collectionName));
        Update update = new Update()
                .set("lastRun", DATE_FORMAT.format(new Date()))
                .set("status", "Completed");

        targetMongoTemplate.upsert(query, update, SchedulerInfo.class, "SchedulerInfo");
    }

    // Transfer data for all collections
    public void transferAllCollections() {
        transferUserstories();
        transferDefect();
        transferTestCase();
    }
}
