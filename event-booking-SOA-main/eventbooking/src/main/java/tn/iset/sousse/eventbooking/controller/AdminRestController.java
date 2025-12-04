package tn.iset.sousse.eventbooking.controller;

import tn.iset.sousse.eventbooking.entity.Evenement;
import tn.iset.sousse.eventbooking.entity.Organisateur;
import tn.iset.sousse.eventbooking.entity.Utilisateur;
import tn.iset.sousse.eventbooking.service.EvenementService;
import tn.iset.sousse.eventbooking.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminRestController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private EvenementService evenementService;

    // GET - Récupérer les organisateurs non approuvés
    @GetMapping("/organisateurs/non-approuves")
    public ResponseEntity<List<Utilisateur>> getOrganisateursNonApprouves() {
        List<Utilisateur> organisateurs = utilisateurService.getOrganisateursNonApprouves();
        return ResponseEntity.ok(organisateurs);
    }

    // PATCH - Approuver un organisateur
    @PatchMapping("/organisateurs/{id}/approuver")
    public ResponseEntity<?> approuverOrganisateur(@PathVariable Long id) {
        Optional<Utilisateur> utilisateurOpt = utilisateurService.getUtilisateurById(id);

        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Utilisateur utilisateur = utilisateurOpt.get();

        if (!(utilisateur instanceof Organisateur)) {
            return ResponseEntity.badRequest().body("Cet utilisateur n'est pas un organisateur");
        }

        ((Organisateur) utilisateur).setApprouve(true);
        Utilisateur updated = utilisateurService.saveUtilisateur(utilisateur);
        return ResponseEntity.ok(updated);
    }

    // PATCH - Rejeter l'approbation d'un organisateur
    @PatchMapping("/organisateurs/{id}/rejeter")
    public ResponseEntity<?> rejeterOrganisateur(@PathVariable Long id) {
        Optional<Utilisateur> utilisateurOpt = utilisateurService.getUtilisateurById(id);

        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Utilisateur utilisateur = utilisateurOpt.get();

        if (!(utilisateur instanceof Organisateur)) {
            return ResponseEntity.badRequest().body("Cet utilisateur n'est pas un organisateur");
        }

        ((Organisateur) utilisateur).setApprouve(false);
        Utilisateur updated = utilisateurService.saveUtilisateur(utilisateur);
        return ResponseEntity.ok(updated);
    }

    // GET - Récupérer tous les utilisateurs
    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    // DELETE - Supprimer un utilisateur
    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.getUtilisateurById(id);

        if (utilisateur.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Récupérer tous les événements (pour gestion admin)
    @GetMapping("/evenements")
    public ResponseEntity<List<Evenement>> getAllEvenements() {
        List<Evenement> evenements = evenementService.getAllEvenements();
        return ResponseEntity.ok(evenements);
    }

    // PATCH - Désactiver un événement
    @PatchMapping("/evenements/{id}/desactiver")
    public ResponseEntity<?> desactiverEvenement(@PathVariable Long id) {
        Optional<Evenement> evenementOpt = evenementService.getEvenementById(id);

        if (evenementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evenement evenement = evenementOpt.get();
        evenement.setActif(false);
        Evenement updated = evenementService.saveEvenement(evenement);
        return ResponseEntity.ok(updated);
    }

    // PATCH - Activer un événement
    @PatchMapping("/evenements/{id}/activer")
    public ResponseEntity<?> activerEvenement(@PathVariable Long id) {
        Optional<Evenement> evenementOpt = evenementService.getEvenementById(id);

        if (evenementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evenement evenement = evenementOpt.get();
        evenement.setActif(true);
        Evenement updated = evenementService.saveEvenement(evenement);
        return ResponseEntity.ok(updated);
    }

    // DELETE - Supprimer définitivement un événement
    @DeleteMapping("/evenements/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        Optional<Evenement> evenement = evenementService.getEvenementById(id);

        if (evenement.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Statistiques globales
    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getAdminStats() {
        List<Utilisateur> utilisateurs = utilisateurService.getAllUtilisateurs();
        List<Evenement> evenements = evenementService.getAllEvenements();

        long nbParticipants = utilisateurs.stream()
                .filter(u -> u.getClass().getSimpleName().equals("Participant"))
                .count();

        long nbOrganisateurs = utilisateurs.stream()
                .filter(u -> u instanceof Organisateur)
                .count();

        long nbOrganisateursApprouves = utilisateurs.stream()
                .filter(u -> u instanceof Organisateur && ((Organisateur) u).isApprouve())
                .count();

        long nbEvenementsActifs = evenements.stream()
                .filter(Evenement::isActif)
                .count();

        AdminStats stats = new AdminStats(
                utilisateurs.size(),
                nbParticipants,
                nbOrganisateurs,
                nbOrganisateursApprouves,
                evenements.size(),
                nbEvenementsActifs);

        return ResponseEntity.ok(stats);
    }

    // Classe interne pour les statistiques admin
    public static class AdminStats {
        private long totalUtilisateurs;
        private long nombreParticipants;
        private long nombreOrganisateurs;
        private long nombreOrganisateursApprouves;
        private long totalEvenements;
        private long nombreEvenementsActifs;

        public AdminStats(long totalUtilisateurs, long nombreParticipants,
                long nombreOrganisateurs, long nombreOrganisateursApprouves,
                long totalEvenements, long nombreEvenementsActifs) {
            this.totalUtilisateurs = totalUtilisateurs;
            this.nombreParticipants = nombreParticipants;
            this.nombreOrganisateurs = nombreOrganisateurs;
            this.nombreOrganisateursApprouves = nombreOrganisateursApprouves;
            this.totalEvenements = totalEvenements;
            this.nombreEvenementsActifs = nombreEvenementsActifs;
        }

        // Getters et Setters
        public long getTotalUtilisateurs() {
            return totalUtilisateurs;
        }

        public void setTotalUtilisateurs(long totalUtilisateurs) {
            this.totalUtilisateurs = totalUtilisateurs;
        }

        public long getNombreParticipants() {
            return nombreParticipants;
        }

        public void setNombreParticipants(long nombreParticipants) {
            this.nombreParticipants = nombreParticipants;
        }

        public long getNombreOrganisateurs() {
            return nombreOrganisateurs;
        }

        public void setNombreOrganisateurs(long nombreOrganisateurs) {
            this.nombreOrganisateurs = nombreOrganisateurs;
        }

        public long getNombreOrganisateursApprouves() {
            return nombreOrganisateursApprouves;
        }

        public void setNombreOrganisateursApprouves(long nombreOrganisateursApprouves) {
            this.nombreOrganisateursApprouves = nombreOrganisateursApprouves;
        }

        public long getTotalEvenements() {
            return totalEvenements;
        }

        public void setTotalEvenements(long totalEvenements) {
            this.totalEvenements = totalEvenements;
        }

        public long getNombreEvenementsActifs() {
            return nombreEvenementsActifs;
        }

        public void setNombreEvenementsActifs(long nombreEvenementsActifs) {
            this.nombreEvenementsActifs = nombreEvenementsActifs;
        }
    }
}
