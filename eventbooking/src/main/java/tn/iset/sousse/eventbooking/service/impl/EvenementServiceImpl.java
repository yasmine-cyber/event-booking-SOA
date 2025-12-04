package tn.iset.sousse.eventbooking.service.impl;

import tn.iset.sousse.eventbooking.entity.Evenement;
import tn.iset.sousse.eventbooking.repository.EvenementRepository;
import tn.iset.sousse.eventbooking.service.EvenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvenementServiceImpl implements EvenementService {

    @Autowired
    private EvenementRepository evenementRepository;

    @Override
    public Evenement saveEvenement(Evenement evenement) {
        if (evenement == null) {
            throw new IllegalArgumentException("L'événement ne peut pas être null.");
        }
        
        return evenementRepository.save(evenement);
    }

    @Override
    public List<Evenement> getAllEvenements() {
        return evenementRepository.findAll();
    }

    @Override
    public Optional<Evenement> getEvenementById(Long id) {
        return evenementRepository.findById(id);
    }

    @Override
    public void deleteEvenement(Long id) {
        evenementRepository.deleteById(id);
    }
}