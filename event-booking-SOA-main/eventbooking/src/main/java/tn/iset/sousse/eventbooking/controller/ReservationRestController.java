package tn.iset.sousse.eventbooking.controller;

import tn.iset.sousse.eventbooking.entity.Reservation;
import tn.iset.sousse.eventbooking.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin
public class ReservationRestController {

    @Autowired
    private ReservationService reservationService;

    // GET - Récupérer toutes les réservations
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    // GET - Récupérer une réservation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationService.getReservationById(id);
        return reservation
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - Récupérer les réservations d'un utilisateur
    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<Reservation>> getReservationsByUtilisateur(@PathVariable Long utilisateurId) {
        List<Reservation> reservations = reservationService.getReservationsByUtilisateur(utilisateurId);
        return ResponseEntity.ok(reservations);
    }

    // GET - Récupérer les réservations d'un événement
    @GetMapping("/evenement/{evenementId}")
    public ResponseEntity<List<Reservation>> getReservationsByEvenement(@PathVariable Long evenementId) {
        List<Reservation> reservations = reservationService.getReservationsByEvenement(evenementId);
        return ResponseEntity.ok(reservations);
    }

    // POST - Créer une nouvelle réservation
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            Reservation saved = reservationService.saveReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de la réservation: " + e.getMessage());
        }
    }

    // DELETE - Annuler une réservation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            Optional<Reservation> reservation = reservationService.getReservationById(id);

            if (reservation.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Statistiques des réservations pour un événement
    @GetMapping("/evenement/{evenementId}/stats")
    public ResponseEntity<ReservationStats> getReservationStats(@PathVariable Long evenementId) {
        List<Reservation> reservations = reservationService.getReservationsByEvenement(evenementId);

        int totalReservations = reservations.size();
        int totalPlaces = reservations.stream()
                .mapToInt(Reservation::getNombreDePlaces)
                .sum();

        ReservationStats stats = new ReservationStats(totalReservations, totalPlaces);
        return ResponseEntity.ok(stats);
    }

    // Classe interne pour les statistiques
    public static class ReservationStats {
        private int nombreReservations;
        private int nombreTotalPlaces;

        public ReservationStats(int nombreReservations, int nombreTotalPlaces) {
            this.nombreReservations = nombreReservations;
            this.nombreTotalPlaces = nombreTotalPlaces;
        }

        public int getNombreReservations() {
            return nombreReservations;
        }

        public void setNombreReservations(int nombreReservations) {
            this.nombreReservations = nombreReservations;
        }

        public int getNombreTotalPlaces() {
            return nombreTotalPlaces;
        }

        public void setNombreTotalPlaces(int nombreTotalPlaces) {
            this.nombreTotalPlaces = nombreTotalPlaces;
        }
    }
}
