package archeage.controllers;

import archeage.DTO.DateDTO;
import archeage.DTO.DateIdDTO;
import archeage.DTO.RequestMarkDTO;
import archeage.models.Mark;
import archeage.models.ScheduleBosses;
import archeage.services.EventService;
import archeage.services.MyMarksService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/mymarks")
@CrossOrigin(origins = "http://localhost:3000")
public class MymarksController {
    private final MyMarksService myMarksService;
    private final EventService eventService;

    public MymarksController(MyMarksService myMarksService, EventService eventService) {
        this.myMarksService = myMarksService;
        this.eventService = eventService;
    }


    @PostMapping("/selectedDate")
    public ResponseEntity<?> handleDate(@Valid @RequestBody DateIdDTO request) {
        try{
            List<Mark> marks = myMarksService.getMarksWhoBeFlag(request);
            return ResponseEntity.ok(Map.of("status", "success",
                    "ScheduleBosses", ScheduleBosses.getScheduleAllBosses(),
                    "Marks", marks,
                    "createdBosses", eventService.getEventByDate(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/changeStatus")
    public ResponseEntity<?> handleMark(@Valid @RequestBody RequestMarkDTO request) {
        try{
            Mark mark = myMarksService.saveMark(request);
            //System.out.println(request.toString());
            return ResponseEntity.ok(Map.of("status", "success",
                    "Mark", mark));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
