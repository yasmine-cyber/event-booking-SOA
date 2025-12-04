package tn.iset.sousse.eventbooking.service.impl;

import tn.iset.sousse.eventbooking.entity.Evenement;
import tn.iset.sousse.eventbooking.entity.Reservation;
import tn.iset.sousse.eventbooking.repository.EvenementRepository;
import tn.iset.sousse.eventbooking.repository.ReservationRepository;
import tn.iset.sousse.eventbooking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EvenementRepository evenementRepository;

    // @Autowired
    // private JavaMailSender mailSender;

    @Override
    public Reservation saveReservation(Reservation reservation) {
        // Validation de base
        if (reservation == null) {
            throw new IllegalArgumentException("La réservation ne peut pas être null.");
        }

        // Vérifier que l'événement existe et qu'il reste des places disponibles
        Optional<Evenement> evenementOptional = evenementRepository.findById(reservation.getEvenement().getId());
        if (evenementOptional.isEmpty()) {
            throw new IllegalArgumentException("Événement non trouvé.");
        }
        Evenement evenement = evenementOptional.get();

        if (evenement.getPlacesDisponibles() < reservation.getNombreDePlaces()) {
            throw new IllegalArgumentException("Pas assez de places disponibles pour cet événement.");
        }

        // Mettre à jour les places disponibles
        evenement.setPlacesDisponibles(evenement.getPlacesDisponibles() - reservation.getNombreDePlaces());
        evenementRepository.save(evenement);

        // Enregistrer la réservation
        Reservation savedReservation = reservationRepository.save(reservation);

        // Envoi d'email désactivé pour la démo (nécessiterait configuration SMTP)
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(reservation.getUtilisateur().getEmail());
        // message.setSubject("Confirmation de réservation - " + evenement.getTitre());
        // message.setText("Bonjour " + reservation.getUtilisateur().getNom() + ",\n\n"
        // +
        // "Votre réservation pour l'événement \"" + evenement.getTitre() + "\" a été
        // confirmée.\n" +
        // "Nombre de places réservées : " + reservation.getNombreDePlaces() + "\n" +
        // "Date de l'événement : " + evenement.getDate() + "\n" +
        // "Lieu : " + evenement.getLieu() + "\n\n" +
        // "Merci de votre participation !");
        // mailSender.send(message);

        return savedReservation;
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    @Override
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée."));
        Evenement evenement = evenementRepository.findById(reservation.getEvenement().getId())
                .orElseThrow(() -> new IllegalArgumentException("Événement non trouvé."));
        evenement.setPlacesDisponibles(evenement.getPlacesDisponibles() + reservation.getNombreDePlaces());
        evenementRepository.save(evenement);
        reservationRepository.deleteById(id);
    }

    @Override
    public List<Reservation> getReservationsByUtilisateur(Long utilisateurId) {
        return reservationRepository.findByUtilisateurId(utilisateurId);
    }

    @Override
    public List<Reservation> getReservationsByEvenement(Long evenementId) {
        return reservationRepository.findByEvenementId(evenementId);
    }
}