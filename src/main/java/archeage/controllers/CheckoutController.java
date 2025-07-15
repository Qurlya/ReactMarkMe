package archeage.controllers;

import archeage.models.Event;
import archeage.services.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/checkout")
@CrossOrigin(origins = "http://localhost:3000")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }


    @GetMapping("/getDates")
    public ResponseEntity<?> getDates() {
        try{
            List<Event> events = checkoutService.getAllDate();

            return ResponseEntity.ok(Map.of("status", "success",
                    "dates", events));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
