package archeage.services;

import archeage.DTO.DateIdDTO;
import archeage.DTO.RequestMarkDTO;
import archeage.models.Event;
import archeage.models.Mark;
import archeage.repository.EventRepository;
import archeage.repository.MarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MyMarksService {
    private final MarkRepository markRepository;
    private final EventRepository eventRepository;
    public MyMarksService(MarkRepository markRepository, EventRepository eventRepository) {
        this.markRepository = markRepository;
        this.eventRepository = eventRepository;
    }
    @Transactional
    public List<Mark> getMarksWhoBeFlag(DateIdDTO dto) {
        List<Mark> optMark = markRepository.findByIdMemberAndStatusInAndDateEventIn(dto.getId(), List.of("confirmed", "waiting"), dto.getDates().values());
        System.out.println(optMark);
        return optMark;
    }

    @Transactional
    public Mark saveMark(RequestMarkDTO dto) {
        long id;
        LocalDate date;
        Optional<Event> opt = eventRepository.findByDateBossAndNameBoss(dto.getDateEvent(), dto.getNameEvent());
        if (opt.isPresent()) {
            id = opt.get().getId();
            date = opt.get().getDateBoss();
        } else {
            Event event = new Event();
            event.setDateBoss(dto.getDateEvent());
            event.setNameBoss(dto.getNameEvent());
            event.setCreated(false);
            eventRepository.save(event);
            id = event.getId();
            date = dto.getDateEvent();
        }
        Optional<Mark> optMark = markRepository.findByIdMemberAndIdEvent(dto.getId(), id);
        Mark mark;
        if (optMark.isPresent()) {
            mark = optMark.get();
            if (mark.getStatus().equals("confirmed")){
                return mark;
            }
            if (mark.getStatus().equals("waiting")){
                mark.setStatus("white");
            } else {
                mark.setStatus("waiting");
            }
        } else {
            mark = new Mark();
            mark.setIdEvent(id);
            mark.setIdMember(dto.getId());
            mark.setDateEvent(date);
            mark.setNameEvent(dto.getNameEvent());
            mark.setStatus("waiting");
            mark.setNameMember(dto.getUser());

        }
        markRepository.save(mark);

        Optional<Mark> optMark1 = markRepository.findByIdEventAndStatus(id, "waiting");
        Optional<Event> optEvent = eventRepository.findById(id);
        Event event = optEvent.get();
        event.setNeedCheck(optMark1.isPresent());
        eventRepository.save(event);
        return mark;
    }
}
