package tn.iset.sousse.eventbooking.service;

import tn.iset.sousse.eventbooking.entity.Evenement;
import java.util.List;
import java.util.Optional;

public interface EvenementService {
    Evenement saveEvenement(Evenement evenement);

    List<Evenement> getAllEvenements();

    Optional<Evenement> getEvenementById(Long id);

    void deleteEvenement(Long id);
}