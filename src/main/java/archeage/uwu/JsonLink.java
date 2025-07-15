package archeage.uwu;

import archeage.models.RequestBoss;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonLink {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static String toJson(RequestBoss req) {
        try {
            System.out.println(12);
            return mapper.writeValueAsString(req);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON serialization error", e);
        }
    }

    public static RequestBoss fromJson(String json) {
        try {
            return mapper.readValue(json, RequestBoss.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON deserialization error", e);
        }
    }
}