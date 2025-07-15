package archeage.controllers;

import archeage.DTO.BossDTO;
import archeage.DTO.DateDTO;
import archeage.DTO.DeleteBossDTO;
import archeage.models.Event;
import archeage.models.ScheduleBosses;
import archeage.services.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class EventsController {
    private final EventService eventService;

    public EventsController(EventService eventService) {
        this.eventService = eventService;
    }


    @PostMapping("/selectedDate")
    public ResponseEntity<?> handleDate(@Valid @RequestBody DateDTO request) {
        String day = request.getDate().getDayOfWeek().toString();

        return ResponseEntity.ok(Map.of("status", "success",
                "ScheduleBosses", ScheduleBosses.getScheduleBosses(day)));
    }
    @PostMapping("/saveBoss")
    public ResponseEntity<?> handleSaveBoss(@RequestBody BossDTO request) {
        try{
            Event event = eventService.addEvent(request);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/deleteBoss")
    public ResponseEntity<?> handleDeleteBoss(@RequestBody DeleteBossDTO request) {
        try{
            eventService.deleteEvent(request);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/updateBoss")
    public ResponseEntity<?> handleUpdateBoss(@RequestBody BossDTO request) {
        try{
            eventService.updateEvent(request);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}