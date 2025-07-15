package archeage.services;

import archeage.DTO.BossDTO;
import archeage.DTO.DateIdDTO;
import archeage.DTO.DeleteBossDTO;
import archeage.models.Event;
import archeage.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    @Transactional
    public Event addEvent(BossDTO bossDTO) {
        Optional<Event> optional = eventRepository.findByDateBossAndNameBoss(bossDTO.getDateBoss(), bossDTO.getNameBoss());
        Event event = new Event();

        if (optional.isPresent()) {
            event = optional.get();
        }

        initBossDTO(bossDTO, event);
        return eventRepository.save(event);
    }

    @Transactional
    public List<Event> getEventByDate(DateIdDTO dto) {
        return eventRepository.findByDateBossInAndCreated(dto.getDates().values(), true);
    }

    @Transactional
    public void deleteEvent(DeleteBossDTO dto) {
        try {
            Optional<Event> optional = eventRepository.findByDateBossAndNameBoss(dto.getDateBoss(), dto.getNameBoss());
            if (optional.isPresent()) {
                Event event = optional.get();
                event.setCreated(false);
                eventRepository.save(event);
            }
        } catch (RuntimeException e) {
            throw new RuntimeException("Ошибка: событие невозможно удалить");
        }
    }
    @Transactional
    public void updateEvent(BossDTO dto) {
        try {
            Optional<Event> optional = eventRepository.findByDateBossAndNameBoss(dto.getDateBoss(), dto.getNameBoss());
            if (optional.isPresent()) {
                Event event = optional.get();
                initBossDTO(dto, event);
                eventRepository.save(event);
            }
        } catch (RuntimeException e) {
            throw new RuntimeException("Ошибка: событие невозможно изменить");
        }
    }
    private void initBossDTO(BossDTO bossDTO, Event event) {
        event.setNameBoss(bossDTO.getNameBoss());
        event.setTimeBoss(bossDTO.getTimeBoss());
        event.setPvpBoss(bossDTO.isPvpBoss());
        event.setNoteBoss(bossDTO.getNoteBoss());
        event.setUrlBoss(bossDTO.getUrlBoss());
        event.setMasterBoss(bossDTO.getMasterBoss());
        event.setDateBoss(bossDTO.getDateBoss());
        event.setCreated(true);
    }
}
