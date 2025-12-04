package tn.iset.sousse.eventbooking.service;

import tn.iset.sousse.eventbooking.entity.Reservation;
import java.util.List;
import java.util.Optional;

public interface ReservationService {
    Reservation saveReservation(Reservation reservation);

    List<Reservation> getAllReservations();

    Optional<Reservation> getReservationById(Long id);

    void deleteReservation(Long id);
    
    List<Reservation> getReservationsByUtilisateur(Long utilisateurId);

    List<Reservation> getReservationsByEvenement(Long evenementId);
}